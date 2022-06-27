import { createContext, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import inclusionVKey from "./inclusion_verification_key.json";
import labelVKey from "./label_verification_key.json";
import axios from "axios";
import { groth16 } from "snarkjs";
import { buildPoseidon } from "circomlibjs";
import fibers from "./Fibers.json";
import { toast } from "react-toastify";
import { Buffer } from "buffer";
const bytes32 = require('bytes32');

const BigInt = require('big-integer');

const contractAddress = '0x2f92D8F6B691d7c1BBf6865350A24fEf15F18FdE';

export const ShipmentContext = createContext();

// TODO: Move to config
const trackerApi = 'http://localhost:2992';

const ShipmentContextProvider = ({ children }) => {
    const [shipments, setShipments] = useState(null);
    const fibersContract = useRef(null);

    useEffect(() => {
        if (fibersContract.current == null) {
            const provider = new ethers.providers.JsonRpcProvider('https://api.s0.ps.hmny.io/');
            fibersContract.current = new ethers.Contract(contractAddress, fibers.abi, provider);
        }
    }, []);

    const runQuery = async (query) => {
        if (query == null || query.trim().length == 0) {

            console.log(query);
            return;
        }

        const toastId = toast('Searching', { isLoading: true, autoClose: false});


        try {
            const res = await axios.get(`${trackerApi}/external/query/${query.trim()}`);
            const rawShipments = res.data.data;

            if (rawShipments.length == 0) {
                throw new Error('Not found');
            }

            const processedShipmentLabels = {};
            const processedShipments = [];
            const poseidon = await buildPoseidon();

            for (const rawShipment of rawShipments) {
                const { prover, shipmentData } = rawShipment;

                for (const currShipment of shipmentData) {
                    const { isWrapper, shipment, itemId, inclusionProof } = currShipment;
                    const { shipmentLabel , shipmentLabelHash, hashProof, sender, recipient } = shipment;

                    if (processedShipmentLabels[shipmentLabelHash]) {
                        continue;
                    }

                    const itemIdHex = Buffer.from(itemId, 'utf-8').toString('hex');
                    const itemIdHash = poseidon.F.toString(poseidon([BigInt(itemIdHex.split('0x')[1], 'hex')]));
                    processedShipmentLabels[shipmentLabelHash] = true;

                    const shipmentLabelHashHex = `0x${shipmentLabelHash}`;
                    console.log(shipmentLabelHashHex);
                    const bcShipment = await fibersContract.current.getShipment(shipmentLabelHashHex);

                    const { 
                        sentShipmentHash,
                        receivedShipmentHash,
                        sentMass,
                        receivedMass,
                        sentDate,
                        receivedDate,
                        senderCompany,
                        senderDepartment,
                        recipientCompany,
                        recipientDepartment,
                        shipmentCreator,
                        creationTimestamp,
                        isConfirmed,
                    } = bcShipment;


                    if (isWrapper) {
                        // console.log({
                        //     shipmentLabelHash: BigInt(shipmentLabelHash, 16).toString(),
                        //     shipmentLabel: BigInt(bytes32({ input: shipmentLabel }, { ignoreLength: true }).split('0x')[1], 16).toString(),
                        //     {
                        //         pi_a: [...hashProof.a, "1"],
                        //         pi_b: [...hashProof.b, ['1','0']],
                        //         pi_c: [...hashProof.c, '1'],
                        //         protocol: 'groth16',
                        //         curve: 'bn128',
                        //     });

                        try {
                            await groth16.verify(
                                labelVKey,
                                [
                                    BigInt(shipmentLabelHash, 16).toString(),
                                    BigInt(bytes32({ input: shipmentLabel }, { ignoreLength: true }).split('0x')[1], 16).toString(),
                                ],
                                {
                                    pi_a: [...hashProof.a, "1"],
                                    pi_b: [...hashProof.b, ['1','0']],
                                    pi_c: [...hashProof.c, '1'],
                                    protocol: 'groth16',
                                    curve: 'bn128',
                                });

                                toast.success(`Valid ZK proof for ${shipmentLabel}`);
                                console.log('Valid proof!');
                        } catch(err) {
                            console.log(err);
                            console.log('Invalid proof...');
                        }
                    } else {
                        try {
                            await groth16.verify(
                                inclusionVKey,
                                [
                                    itemIdHash,
                                    BigInt(shipmentLabelHash, 16).toString(), 
                                    BigInt(sentShipmentHash.split('0x')[1], 16),
                                ],
                                {
                                    pi_a: [...inclusionProof.a, "1"],
                                    pi_b: [...inclusionProof.b, ['1','0']],
                                    pi_c: [...inclusionProof.c, '1'],
                                    protocol: 'groth16',
                                    curve: 'bn128',
                                });
                                toast.success(`Valid ZK proof for ${shipmentLabel}`);
                        } catch(err) {
                            console.log(err);
                            console.log('Invalid proof...');
                        }
                    }


                    // TODO: Verify ZK proof
                    // TODO: Compaer blockchain data against received data

                    const processedShipment = {
                        shipmentLabel,
                        itemLabel: isWrapper ? null : itemId,
                        isConfirmed,
                        senderCompany: sender.companyTitle,
                        senderDepartment: sender.departmentTitle,
                        recipientCompany: recipient.companyTitle,
                        recipientDepartment: recipient.departmentTitle,
                        sentMass: sentMass != 0 ? sentMass : null,
                        receivedMass: sentMass != 0 ? receivedMass : null,
                        sentDate: sentDate != 0 ? new Date(parseInt(sentDate)).toISOString().split('T')[0] : null,
                        receivedDate: receivedDate != 0 ? new Date(parseInt(receivedDate)).toISOString().split('T')[0] : null,
                        creationTimestamp: parseInt(creationTimestamp),
                        shipmentCreator,
                        sentHash: sentShipmentHash,
                        receivedHash: receivedShipmentHash,
                        coordinates: [
                            [
                                sender.latitude,
                                sender.longitude,
                            ],
                            [
                                recipient.latitude,
                                recipient.longitude,
                            ]
                        ]
                    };

                    processedShipments.push(processedShipment);
                }
            }

            setShipments(processedShipments.sort((a, b) => a.creationTimestamp - b.creationTimestamp));
            toast.update(toastId, { isLoading: false, render: 'Shipment found!', autoClose: 1000, type: toast.TYPE.SUCCESS});
        } catch (err) {

            console.log(err);
            toast.update(toastId, { isLoading: false, render: 'Shipment not found!', autoClose: 1000, type: toast.TYPE.ERROR});
            setShipments(null);
        }
    }

    return (
        <ShipmentContext.Provider value={{ shipments, runQuery }}>
            { children }
        </ShipmentContext.Provider>
    )
}

export default ShipmentContextProvider;
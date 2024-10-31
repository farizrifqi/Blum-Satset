import axios from "axios"

// https://github.com/zuydd/database/blob/main/blum.json
export const getPayloadServer = async () => {
    try {
        const response = await axios.get("https://raw.githubusercontent.com/zuydd/database/main/blum.json")
        if (response?.data?.payloadServer) {
            return response.data.payloadServer
        }
        return null
    } catch (err) {
        console.log(`error getPayloadServer`)
        return null
    }

}

export const encryptPayload = async (server: string, { gameId, points, dogs }:
    { gameId: string, points: number, dogs: number }) => {
    try {
        const { data } = await axios.post(`https://${server}.vercel.app/api/blum`, {
            game_id: gameId,
            points,
            dogs,
        });
        if (data.payload) {
            return data
        }
        return null
    } catch (err) {
        console.log(`error encryptPayload`)
        return null
    }
}

export const encryptPayloadV2 = async ({ gameId, points, dogs }:
    { gameId: string, points: number, dogs?: number }) => {
    const Blum: any = await import("../lib/worker.js").then(module => module.Blum);

    try {
        const challenge = Blum.getChallenge(gameId);
        const uuidChallenge = Blum.getUUID();

        const payload = Blum.getPayload(
            gameId,
            {
                id: uuidChallenge,
                nonce: challenge.nonce,
                hash: challenge.hash,
            },
            {
                CLOVER: {
                    amount: points.toString(),
                }
            }
        );
        return payload
    } catch (err) {
        console.log(`error encryptPayloadV2`)
        return null
    }
}
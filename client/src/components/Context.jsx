import React, {useContext, createContext} from 'react'
import {useAddress, useContract, useMetamask, useContractWrite} from '@thirdweb-dev/react'
import {ethers} from 'ethers'
import {EditionMetadataWithOwnerOutputSchema} from '@thirdweb-dev/sdk'
import Web3 from 'web3'

const StateContext = createContext()

export const StateContextProvider = ({children}) => {
    const {contract} = useContract("0x3Df4E1124F21f82a87A82919aAEE614CB5D2Caa4")
    const {mutateAsync: createChit, isLoading, error} = useContractWrite(contract, 'createChit')
    
    const address = useAddress()
    const connect = useMetamask()

    let web3 = new Web3(Web3.currentProvider)
    
    const publishChit = async(form) => {
        console.log(form)
        const month = 5; // May
        const year = 2023;

        const date = new Date(year, month - 1);
        const monthUnix = date.getTime() / 1000;
        try{
            const data = await createChit({
                args:[
                    form.title,
                    form.desc,
                    Math.floor(ethers.utils.formatUnits(ethers.utils.parseEther(form.total), "gwei")),
                    Math.floor(ethers.utils.formatUnits(ethers.utils.parseEther(form.inst), "gwei")),
                    monthUnix,
                    form.participants,
                    Date.parse(form.deadline) / 1000
                ]
            })
            console.log(data)
        }catch(error){
            console.log(error)
        }
    }

    return(
        <StateContext.Provider value={{
            connect,
            address,
            publishChit
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)
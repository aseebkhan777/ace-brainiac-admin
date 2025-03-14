import { Edit, Eye } from "lucide-react"
import Button from "../button/index.jsx"
import Chip from "../chip/index.jsx"
import Label from "../label/index.jsx"
import {Stack} from "../stack/index.jsx"
import { theme } from "../../utils/theme.js"
export function TestCard({details} ){
    return (
        <div className={`bg-white border border-[1px solid ${theme.main}] rounded-md p-2 w-[300px]`}>
            <Stack direction="row" className={'justify-between'}>
                <div className="text-lg font-bold">{details?.title}</div>
                <Label color='green' className="text-sm text-gray-500 font-bold">{details.status}</Label>
            </Stack>
            <Chip color='yellow' className="mt-2">{details.subject}</Chip>

            <Stack className="mt-2 font-bold">
                <div>15 Questions</div>
                <div>30 Students took it already</div>
            </Stack>
            <Stack direction="row" className="mt-2 justify-between">
                <Button variant="outlined" className='flex items-center justify-center gap-1' color='theme'><Eye/> View</Button>
                <Button className='flex items-center justify-center gap-1' color='theme'><Edit style={{width:'20px'}} /> Edit</Button>
            </Stack>    
        </div>
    )
}

export function WorksheetCard({details}){
    return (
        <div>
        {JSON.stringify(details)}
        </div>
    )
}

export function SchoolCard({details}){
    return (
        <div>
        {JSON.stringify(details)}
        </div>
    )
}

export function StudentCard({details}){
    return (
        <div>
        {JSON.stringify(details)}
        </div>
    )
}

export function MembershipCard({details}){
    return (
        <div>
            {JSON.stringify(details)}
        </div>
    )
}




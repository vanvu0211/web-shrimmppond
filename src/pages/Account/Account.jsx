import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'

function Account (){

    const navigate = useNavigate()

    return (
        <>
            <div className ="flex">
                <Sidebar />
                <h1 onClick = {() => {navigate("/")}}>
                    Account Page
                </h1>
            </div>
        </>
    )
}

export default Account
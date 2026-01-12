import { CiMenuKebab } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
const Header = () => {
    return (
        <header className='bg-white  flex justify-between px-4 py-4 border-b border-[#E2E8F0]'>
            <h1 className="Logo  bg-linear-to-r from-[#2a51ff] via-[#6e58ff] to-[#7b67ff] text-transparent bg-clip-text font-bold text-2xl font-hfont">Axion</h1>
            <button className="menu">
                <BsThreeDots size={20}   style={{ transform: 'rotate(90deg)' }} />
            </button>
        </header>
    )
}

export default Header

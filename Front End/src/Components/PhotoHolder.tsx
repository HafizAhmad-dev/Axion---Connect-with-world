import useInitials from "../hooks/useInitials";

type PhotoHolderProps = {
    css?: string;
    username: string
};
const PhotoHolder = (props: PhotoHolderProps) => {
    const initials = useInitials(props.username);
    return (
        <div
            className={`relative grid place-items-center w-10 h-10 overflow-hidden rounded-full bg-linear-to-br from-[rgb(136,127,255)] to-[#a44cfd] ${props.css || ""}`}
        >
            <span
                className={`text-white font-semibold leading-none select-none
                        ${initials.length === 2 ? "text-md tracking-wide" : "text-lg"}
                            `}
            >
                {initials}
            </span>
        </div>


    )
}

export default PhotoHolder

// image rounded-full h-10 w-10 bg-linear-to-br from-[#887FFF] to-[#a44cfd]
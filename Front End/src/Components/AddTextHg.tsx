
const AddTextHg = () => {
    return (
        <div className='h-full w-full flex justify-center py-7'>
            <div className="preview relative w-[90%] h-60 rounded-2xl bg-linear-to-br from-[#677AE5] to-[#754CA4]">
                <textarea
                    className="absolute inset-0 border border-black bg-transparent text-white resize-none p-4 outline-none caret-white "
                    placeholder="Type here..."
                />
            </div>
        </div>
    )
}

export default AddTextHg

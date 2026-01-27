
interface DevBlockProps {
  show?: boolean;
  message?: string;
}

const UnderDev = ({ show = true, message = "Under development" }: DevBlockProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg px-5 py-3 text-center">
        <p className="font-medium text-gray-800">{message}</p>
        <p className="text-xs text-gray-500 mt-1">
          This section is in Developement ❤️
        </p>
      </div>
    </div>
  );
};

export default UnderDev;

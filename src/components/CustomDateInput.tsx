import { forwardRef } from "react";

type Props = {
    value?: string;
    onClick?: () => void;
    placeholder?: string;
};

const CustomDateInput = forwardRef<HTMLInputElement, Props>(
    ({ value, onClick, placeholder }, ref) => {
        return (
            <input
                ref={ref}
                value={value || ""}
                onClick={onClick}
                placeholder={placeholder}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
        );
    }
);

export default CustomDateInput;
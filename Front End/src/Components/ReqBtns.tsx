import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import type { ElementType } from 'react';

type Props = {
    varient: 'accept' | 'decline'
}
type BtnProperties = {
    label: 'Accept' | 'Decline';
    icon: ElementType;
    styles: string;
}

const ReqBtns = ({ varient: action }: Props) => {
    const btnProperties: Record<'accept' | 'decline', BtnProperties> = {
        accept: {
            label: 'Accept',
            icon: Check,
            styles: 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600   text-white'
        },
        decline: {
            label: 'Decline',
            icon: X,
            styles: 'bg-gray-300/70 text-black'
        }
    };

    const { label, icon, styles } = btnProperties[action];
    const IconComponent = icon;
    return (
        <button
            className={` px-8 py-2 flex items-center gap-1 font-hfont rounded-xl ${styles}`}>
            {<IconComponent size={16} />}
            {label}
        </button>
    )
}

export default ReqBtns

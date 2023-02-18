import { StorageReference } from "firebase/storage";
import uuid from "react-uuid";

type Folder = {
    name: string;
    ref: StorageReference;
};


type DropdownProps = {
    label: string;
    options: Folder[];
    selectedOption: Folder | null;
    onSelectOption: (option: Folder) => void;
};

export const Dropdown = ({ label, options, selectedOption, onSelectOption }: DropdownProps) => {

    console.log("options: ", options)

    return (
        <div>
            <label>{label}</label>
            <select title="test" value={selectedOption?.name || ''} onChange={(e) => {
                const selectedName = e.target.value;
                const selectedOption = options.find(option => option.name === selectedName);
                if (selectedOption) {
                    onSelectOption(selectedOption);
                }
            }}>

                <option value="">-- Please choose an option --</option>
                {options.map((option) => (
                    <option key={uuid()} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>

        </div >
    );
};

import flatpickr from "flatpickr";
import { useEffect } from "react";

const DatePicker = () => {
    useEffect(() => {
        // Init flatpickr
        flatpickr(".form-datepicker", {
            mode: "range",
            static: true,
            monthSelectorType: "static",
            dateFormat: "M j, Y",
            prevArrow:
                '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
            nextArrow:
                '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        });
    }, []);

    return (
        <div>
            <label className="text-body-2xlg font-bold text-dark dark:text-white">
                Choose Range
            </label>
            <div className="relative pr-18 pt-4">
                <input
                    className="form-datepicker w-1/4 rounded-[7px] border-[1.5px] border-[#302e2e] bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                    placeholder="From - To: mm/dd/yyyy"
                    data-class="flatpickr-right"
                />
            </div>
        </div>
    );
};

export default DatePicker;

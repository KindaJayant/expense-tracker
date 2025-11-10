import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline"; // optional tiny icons

// If you don't have @heroicons/react installed, replace the <ChevronUpDownIcon/> and <CheckIcon/>
// with simple unicode arrows or remove them. To install icons: npm i @heroicons/react

type Option = string;

export default function FancySelect({
  value,
  onChange,
  options,
  className = "",
}: {
  value: Option;
  onChange: (val: Option) => void;
  options: Option[];
  className?: string;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button className="w-full input px-3 py-2 flex items-center justify-between">
          <span>{value}</span>
          <ChevronUpDownIcon className="h-4 w-4 opacity-70" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 mt-2 w-full rounded-xl bg-card/95 backdrop-blur border border-white/10 shadow-glow focus:outline-none p-1">
            {options.map((opt) => (
              <Listbox.Option
                key={opt}
                value={opt}
                className={({ active }) =>
                  `cursor-pointer rounded-lg px-3 py-2 text-sm flex items-center justify-between ${
                    active ? "bg-white/10" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className="text-white/90">{opt}</span>
                    {selected && <CheckIcon className="h-4 w-4 text-accent" />}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

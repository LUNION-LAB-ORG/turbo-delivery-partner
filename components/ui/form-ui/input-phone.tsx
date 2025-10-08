'use client';

import PhoneInput, { isPossiblePhoneNumber, Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Input as InputNextUI } from "@heroui/react";
import { forwardRef, useMemo } from 'react';

import { cn } from '@/lib/utils';

interface InputPhoneProps extends React.ComponentPropsWithoutRef<typeof PhoneInput> {
    value: string;
    setValue: (value: Value | string) => void;
}

const InputPhone = forwardRef<React.ElementRef<typeof PhoneInput>, InputPhoneProps>(
    (props, ref) => {
        const { className, value, setValue, ...otherProps } = props;

        const handleSelectionChange = (val: Value) => {
            if (val) {
                // Toujours forcer le préfixe CI (+225)
                if (!val.startsWith('+225')) {
                    setValue('+225' + val.replace(/^\+?\d*/, '')); // nettoie et concatène
                } else {
                    setValue(val);
                }
            } else {
                setValue('+225'); // valeur par défaut si vide
            }
        };

        const isContactValid = useMemo((): boolean => {
            if (value == '' || (value && isPossiblePhoneNumber(value))) return true;
            return false;
        }, [value]);

        return (
            <PhoneInput
                ref={ref}
                international
                aria-label="phone_number input"
                className={cn('disabled:cursor-not-allowed', className)}
                countryCallingCodeEditable={false} // 🔒 empêche l’édition du code pays
                errorMessage={!isContactValid ? 'N° Téléphone Incorrect' : ''}
                inputComponent={InputNextUI}
                placeholder="Entrer N° Téléphone"
                defaultCountry="CI"
                value={value || '+225'} // si rien, préremplir avec +225
                onChange={handleSelectionChange}
                inputClassName="rounded-md"
                {...otherProps}
            />
        );
    }
);

InputPhone.displayName = 'InputPhone';

export { InputPhone };

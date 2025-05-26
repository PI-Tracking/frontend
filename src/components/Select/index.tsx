import React from 'react';
import styles from './styles.module.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
}

function Select({ value, onChange, options, placeholder }: SelectProps) {
  return (
    <select 
      className={styles.select}
      value={value}
      onChange={onChange}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select; 
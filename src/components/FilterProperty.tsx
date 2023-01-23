import React from 'react';

type PropsFilterProperty = {
  label: string;
  handleRemoveProperty: (propertyName: string) => void;
};
const FilterProperty = (props: PropsFilterProperty): JSX.Element => {
  const { label, handleRemoveProperty } = props;

  return (
    <div className="filter-property-container border-radius-medium">
      <span className="filter-property-label" aria-hidden>
        {label}
      </span>

      <button
        type="button"
        onClick={() => handleRemoveProperty(label)}
        className="filter-property-button-remove"
        aria-label={`remove ${label} from the filter`}
      />
    </div>
  );
};

export default FilterProperty;

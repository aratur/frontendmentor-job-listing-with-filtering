import React, { useCallback, useEffect, useState } from 'react';
import FilterProperty from './FilterProperty';

type Props = {
  handleClearFilter: () => void;
  handleRemoveProperty: (propertyName: string) => void;
  filterProperties: Array<string>;
};

const Filter = (props: Props) => {
  const { handleClearFilter, filterProperties, handleRemoveProperty } = props;

  const [filterBlurOut, setFilterBlurOut] = useState<'' | 'filter-blur-out'>(
    ''
  );
  const [hiddenClassName, setHiddenClassName] = useState<'' | 'hidden'>('');

  useEffect(() => {
    const hasNoFilterProperties = filterProperties.length === 0;

    if (hasNoFilterProperties) {
      setFilterBlurOut('filter-blur-out');
      setHiddenClassName('hidden');
    } else {
      setHiddenClassName('');
      setFilterBlurOut('');
    }
  }, [filterProperties]);

  const animateBlur = (callbackFunction: () => void) => {
    setFilterBlurOut('filter-blur-out');
    // should be equal to $clear-filter-animation-duration
    //  + $animation-delay
    const delayClearFilter = 400;
    setTimeout(callbackFunction, delayClearFilter);
  };

  const handleRemovePropertyInternal = (propertyName: string) => {
    // if the last property is being removed from the filter
    // initialize the blur out animation
    // and pass up the event
    if (filterProperties.length === 1) {
      animateBlur(() => handleRemoveProperty(propertyName));
    } else {
      handleRemoveProperty(propertyName);
    }
  };

  const handleClearFilterInternal = useCallback(() => {
    animateBlur(handleClearFilter);
  }, [handleClearFilter]);

  return (
    <div
      className={`filter border-radius-medium ${hiddenClassName} ${filterBlurOut}`}
    >
      <div className="filter-properties-container">
        {filterProperties.map((filterProperty) => (
          <FilterProperty
            key={filterProperty}
            label={filterProperty}
            handleRemoveProperty={handleRemovePropertyInternal}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleClearFilterInternal}
        className="filter-button-clear"
      >
        Clear
      </button>
    </div>
  );
};

export default Filter;

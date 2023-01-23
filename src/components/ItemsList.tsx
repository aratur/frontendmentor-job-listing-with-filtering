import React, { useState } from 'react';
import ItemCard from './ItemCard';
import Job from '../model/Job';
import Filter from './Filter';

type Props = { data: Job[] };
const ItemsList = (props: Props) => {
  const { data } = props;
  const [filterProperties, setFilterProperties] = useState<Array<string>>([]);

  const handlePropertyClicked = (id: number, propertyName: string) => {
    const copyFilterProperties = [...filterProperties];

    const hasProperty =
      copyFilterProperties.findIndex((property) => property === propertyName) >
      -1;
    if (!hasProperty) {
      copyFilterProperties.push(propertyName);
      setFilterProperties(copyFilterProperties);
    }
  };

  const clickAnimationDelay = (updateFunction: () => void) => {
    // should be equal to  $click-animation-duration from _mixins.scss
    const clickAnimationDuration = 100;
    setTimeout(updateFunction, clickAnimationDuration);
  };

  const handleRemoveProperty = (propertyName: string) => {
    const newFilterProperties = filterProperties.filter(
      (property) => property !== propertyName
    );

    const updateFunction = () => setFilterProperties(newFilterProperties);
    clickAnimationDelay(updateFunction);
  };

  const handleClearFilter = () => {
    setFilterProperties([]);
  };

  const filterFunction = (item: Job): boolean => {
    // if there is nothing to filter
    if (filterProperties.length === 0) return true;

    const { role, level, languages, tools } = item;
    const properties = [role, level, languages, tools]
      .flat(1)
      .filter((p) => p.length > 0);
    // if there is nothing to apply the filter to
    if (properties.length === 0) return false;

    // all filter options need to be included in the job posting
    const noOfMatches = filterProperties.filter((p) => properties.includes(p));
    return noOfMatches.length === filterProperties.length;
  };

  return (
    <div className="App">
      <Filter
        handleClearFilter={handleClearFilter}
        filterProperties={filterProperties}
        handleRemoveProperty={handleRemoveProperty}
      />
      <section className="items-list" data-testid="items-list">
        {data.filter(filterFunction).map((item) => (
          <ItemCard
            key={item.id}
            jobItem={item}
            handlePropertyClicked={handlePropertyClicked}
          />
        ))}
      </section>
    </div>
  );
};

export default ItemsList;

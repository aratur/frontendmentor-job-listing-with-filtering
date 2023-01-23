import React from 'react';
import Job from '../model/Job';

type Props = {
  jobItem: Job;
  handlePropertyClicked: (id: number, propertyName: string) => void;
};

const ItemCard = (props: Props) => {
  const { jobItem, handlePropertyClicked } = props;
  const {
    id,
    company,
    logo,
    new: newJob,
    featured,
    position,
    role,
    level,
    postedAt,
    contract,
    location,
    languages,
    tools,
  } = jobItem;

  const properties = [role, level, languages, tools].flat(1);

  const featuredClass = featured ? 'is-featured' : '';

  return (
    <div
      id={id.toString()}
      key={id.toString()}
      data-testid={`item-card-${id.toString()}`}
      className={`item-card ${featuredClass} border-radius-medium`}
    >
      <div className="item-left-side-container">
        <img
          src={logo}
          alt={`company logo of ${company}`}
          className="item-logo"
        />
        <div className="item-description-container">
          <div className="item-header">
            <h3 className="item-company">{company}</h3>
            <div data-testid="item-header-tiles" className="item-header-tiles ">
              {newJob ? (
                <div className="item-new border-radius-large">new!</div>
              ) : null}
              {featured ? (
                <div className="item-featured border-radius-large">
                  featured
                </div>
              ) : null}
            </div>
          </div>
          <h2 className="item-position">
            <a href={`#${id.toString()}`}>{position}</a>
          </h2>
          <div className="item-options-container">
            <div className="item-posted-at">{postedAt}</div>
            <div className="item-contract">{contract}</div>
            <div className="item-location">{location}</div>
          </div>
        </div>
      </div>
      <div className="item-horizontal-line" />
      <div className="item-properties">
        {properties.map((p, index) =>
          p.length > 0 ? (
            <button
              onClick={() => handlePropertyClicked(id, p)}
              key={`${p}-${id}-${index.toString()}`}
              type="button"
              className="border-radius-small"
            >
              {p}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ItemCard;

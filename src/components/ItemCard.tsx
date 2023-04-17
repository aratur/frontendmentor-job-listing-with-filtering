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
      data-testid={`card-item-${id.toString()}`}
      className={`card-item ${featuredClass} border-radius-medium`}
    >
      <div className="card-item__left-side">
        <img
          src={logo}
          alt={`company logo of ${company}`}
          className="card-item__logo"
        />
        <div className="card-item__description">
          <div className="card-item__header">
            <h3 className="card-item__company">{company}</h3>
            <div data-testid="card-item__tiles" className="card-item__tiles ">
              {newJob ? (
                <div className="card-item__new border-radius-large">new!</div>
              ) : null}
              {featured ? (
                <div className="card-item__featured border-radius-large">
                  featured
                </div>
              ) : null}
            </div>
          </div>
          <h2 className="card-item__position">
            <a href={`#${id.toString()}`}>{position}</a>
          </h2>
          <div className="card-item__options">
            <div className="card-item__posted-at">{postedAt}</div>
            <div className="card-item__contract">{contract}</div>
            <div className="card-item__location">{location}</div>
          </div>
        </div>
      </div>
      <div className="card-item__horizontal-line" />
      <div className="card-item__properties">
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

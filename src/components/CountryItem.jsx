import styles from "./CountryItem.module.css";

function CountryItem({ cur }) {
  return (
    <li className={styles.countryItem}>
   <span>{cur.emoji}</span>
      <span>{cur.country}</span>

    </li>
  );
}

export default CountryItem;

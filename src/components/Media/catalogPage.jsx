import styles from './media.module.scss';
import CategoryFinder from "./categoryFinder";
import movieStorage from "./movieStorage";
import Input from "../Input";
import electronConnector from "../../helpers/electronConnector";
import {useState} from "react";

const catalogPage = ({pageData, selectMovie, goTo}) => {
    const [temp, setTemp] = useState([]);

    const renderPagination = () => {
        return (
            <div className={styles.pagination}>
                <button tabIndex={1} onClick={() => goTo(pageData.pagination.prev)}
                        disabled={!Boolean(pageData.pagination.prev)}
                >Previous
                </button>
                <button tabIndex={1} onClick={() => goTo(pageData.pagination.next)}
                        disabled={!Boolean(pageData.pagination.next)}
                >Next
                </button>
            </div>
        )
    }

    const renderCategories = () => {

        return (
            <ul className={styles.categories}>
                {pageData.categories.map((category) => (
                    <li key={category.title}>
                        <details>
                            <summary>{category.title}</summary>
                            <CategoryFinder data={category.data} goTo={goTo}/>
                        </details>
                    </li>
                ))}
            </ul>
        )
    }

    const renderSearch = () => {
        return (
            <Input
                label={'Search'}
                onChange={({value}) => {
                    if (value && value.length > 2) {
                        electronConnector.movieSearch(value).then(setTemp)
                    }
                }}
                children={(
                    <ul className={styles.search}>
                        {temp.map(({title, href, description}) => (
                            <li key={href} onClick={() => {
                                selectMovie(href)
                            }}>
                                <span>{title} {description}</span>
                            </li>)
                        )}
                    </ul>
                )}
            />
        )
    }

    return (
        <div className={styles.wrapperCatalog}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start'}}>
                {renderSearch()}
                {renderCategories()}
            </div>
            {renderPagination()}
            <h2>Catalog</h2>
            <ul className={styles.catalogList}>
                {pageData.list.map((item) => (
                    <li key={item.href} tabIndex={1} onClick={() => {
                        selectMovie(item.href)
                    }}>
                        <img src={item.image} alt={item.title}/>
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>
            {renderPagination()}
            <h2>History</h2>
            <ul className={styles.catalogList}>
                {movieStorage.history.map((item) => (
                    <li key={item.href} tabIndex={1} onClick={() => {
                        selectMovie(item.href)
                    }}>
                        <img src={item.image} alt={item.title}/>
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default catalogPage
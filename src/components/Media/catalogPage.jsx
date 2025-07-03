import styles from './media.module.scss';
import CategoryFinder from "./categoryFinder";
import movieStorage from "./movieStorage";
import Input from "../Input";
import electronConnector from "../../helpers/electronConnector";
import {useEffect, useState} from "react";
import useFooterActions from "../../hooks/useFooterActions";

const catalogPage = ({pageData, selectMovie, goTo}) => {
    const [temp, setTemp] = useState([]);
    const [tab, setTab] = useState(0);
    const {setFooterActions, removeFooterActions} = useFooterActions()
    const [activeCategory, setActiveCategory] = useState(null)
    useEffect(() => {
        setFooterActions({
            rb: {
                button: 'rb',
                title: 'History',
                onClick: () => {
                    setTab(1)
                }
            },
            lb: {
                button: 'lb',
                title: 'Catalog',
                onClick: () => {
                    setTab(0)
                }
            }
        })
        return () => {
            removeFooterActions(['rb', 'lb'])
        }
    }, [])
    const renderPagination = () => {
        return (
            <div className={styles.pagination}>
                <button tabIndex={Boolean(pageData.pagination.prev) ? 1 : -1}
                        onClick={() => goTo(pageData.pagination.prev)}
                        disabled={!Boolean(pageData.pagination.prev)}
                >Previous
                </button>
                <button tabIndex={Boolean(pageData.pagination.next) ? 1 : -1}
                        onClick={() => goTo(pageData.pagination.next)}
                        disabled={!Boolean(pageData.pagination.next)}
                >Next
                </button>
            </div>
        )
    }

    const renderCategories = () => {
        return (
            <ul className={styles.categories}>
                {pageData.categories.map((category, index) => (
                    <li key={category.title}>
                        <details>
                            <summary tabIndex={1} onClick={() => {
                                setActiveCategory(a => a === index ? null : index)
                            }}>{category.title}</summary>
                            {activeCategory === index ? <CategoryFinder data={category.data} goTo={a => {
                                goTo(a)
                                setTab(0)
                            }}/> : null}
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
                            <li key={href} tabIndex={1} onClick={() => {
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

    const tabs = [<>
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
    </>, <>
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
    </>]

    return (
        <div className={styles.wrapperCatalog}>
            <div style={{display: 'grid', gridTemplateColumns: '2fr 3fr', alignItems: 'start', gap: 'var(--gap)'}}>
                {renderCategories()}
                {renderSearch()}
            </div>
            {tabs[tab]}
        </div>
    )
}

export default catalogPage
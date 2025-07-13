import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {getPageData,MoviesListItem} from "@type/electron.types";
import type {MovieStorageHistory} from "@type/movieStorage.types";
import type {footerActionsType} from "@type/provider.types";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Input from "../Input";

import CategoryFinder from "./categoryFinder";
import movieStorage from "./movieStorage";

import styles from './media.module.scss';

const CatalogPage = ({pageData, selectMovie, goTo}: {
    pageData: getPageData
    selectMovie: (url: string) => void
    goTo: (url: string) => void
}) => {
    const [temp, setTemp] = React.useState([]);
    const [tab, setTab] = React.useState(0);
    const {setFooterActions, removeFooterActions} = useFooterActions()
    const [activeCategory, setActiveCategory] = React.useState<number>(null)
    React.useEffect(() => {
        setFooterActions({
            lb: {
                button: 'lb',
                onClick: () => {
                    setTab(0)
                },
                title: i18n.t('Catalog')
            },
            rb: {
                button: 'rb',
                onClick: () => {
                    setTab(1)
                },
                title: i18n.t('History')
            }
        })
        return () => {
            removeFooterActions(['rb', 'lb'])
        }
    }, [])

    const renderPagination = () => {
        if (tab === 1) return null
        return (
            <div className={styles.pagination}>
                <button tabIndex={pageData.pagination.prev ? 1 : -1}
                        type="button"
                        onClick={() => goTo(pageData.pagination.prev)}
                        disabled={!pageData.pagination.prev}
                >{i18n.t('Previous')}
                </button>
                <button tabIndex={pageData.pagination.next ? 1 : -1}
                        type="button"
                        onClick={() => goTo(pageData.pagination.next)}
                        disabled={!pageData.pagination.next}
                >{i18n.t('Next')}
                </button>
            </div>
        )
    }

    const renderCategories = () => {
        return (
            <ul className={styles.categories}>
                {pageData.categories.map((category, index: number) => (
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
                label={i18n.t('Search')}
                onChange={({value}) => {
                    if (value && (value as string).length > 2) electronConnector.movieSearch(value as string).then(setTemp)
                }}
                children={(
                    <ul className={styles.search}>
                        {temp.map(({title, href, description}) => (
                            <li key={href} role="button" tabIndex={1} onClick={() => {
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

    const renderMovieItem = (item: MoviesListItem | MovieStorageHistory) => (
        <li key={item.href} tabIndex={1}
            role="button"
            onFocus={() => {
                const action = (inHistory: boolean): footerActionsType => ({
                    y: {
                        button: 'y',
                        onClick: () => {
                            if (inHistory) movieStorage.removeHistory(item.href)
                            else movieStorage.addToHistory({
                                image: item.image,
                                title: item.title,
                                url: item.href
                            })

                            setFooterActions(action(!inHistory))
                        },
                        title: inHistory ? i18n.t('Remove from history') : i18n.t('Add to history')
                    }
                })
                setFooterActions(action(
                    Boolean((movieStorage.getHistory(item.href) as MovieStorageHistory).href)
                ))
            }}
            onBlur={() => {
                removeFooterActions(['y'])
            }}
            onClick={() => {
                selectMovie(item.href)
            }}>
            <img src={item.image} alt={item.title}/>
            <span>{item.title}</span>
        </li>
    )

    const tabs: { heading: string, items: (MoviesListItem | MovieStorageHistory)[] }[] = [{
        heading: pageData.heading,
        items: pageData.list,
    }, {
        heading: i18n.t('History'),
        items: movieStorage.history,
    }]

    return (
        <div className={styles.wrapperCatalog}>
            <div style={{alignItems: 'start', display: 'grid', gap: 'var(--gap)', gridTemplateColumns: '2fr 3fr'}}>
                {renderCategories()}
                {renderSearch()}
            </div>
            <h2>{tabs[tab].heading}</h2>
            {renderPagination()}
            <ul className={styles.catalogList}>
                {tabs[tab].items.map(renderMovieItem)}
            </ul>
            {renderPagination()}
        </div>
    )
}

export default CatalogPage
import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {getPageData, MoviesListItem} from "@type/electron.types";
import type {MovieStorageHistory} from "@type/movieStorage.types";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
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
    const [history, setHistory] = React.useState<MovieStorageHistory[]>(movieStorage.history)

    const toggleViewMode = (direction: 'previous' | 'next') => {
        if (direction === 'previous') {
            if (tab === 0) setTab(2)
            else setTab(tab - 1)
        }

        if (direction === 'next') {
            if (tab === 2) setTab(0)
            else setTab(tab + 1)
        }
    }

    React.useEffect(() => {
        setFooterActions({
            lb: {
                button: 'lb',
                onClick: () => {
                    toggleViewMode('previous')
                }
            },
            rb: {
                button: 'rb',
                onClick: () => {
                    toggleViewMode('next')
                }
            }
        })
        if(getFromStorage('movies').authorized){
            electronConnector.getMoviesHistory().then(setHistory)
        }
        return () => {
            removeFooterActions(['rb', 'lb'])
        }
    }, [tab])

    const renderPagination = () => {
        if (tab !== 0) return null
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
            onClick={() => {
                selectMovie(item.href)
            }}>
            <img src={item.image} alt={item.title}/>
            <span>{item.title}</span>
            <small>{item.subtitle}</small>
        </li>
    )

    const tabs: { heading: string, items: (MoviesListItem | MovieStorageHistory)[] }[] = [{
        heading: pageData.heading,
        items: pageData.list,
    }, {
        heading: i18n.t('Favorites'),
        items: movieStorage.favorites,
    }, {
        heading: i18n.t('History'),
        items: history,
    }]

    const renderCollections = () => {
        return (
            <ul className={styles.collectionsList}>{pageData.links.map(item => (
                <li key={item.href}>
                    <button tabIndex={1} type="button" onClick={() => {
                        goTo(item.href)
                        setTab(0)
                    }}>{item.title}</button>
                </li>))
            }</ul>
        )
    }

    const renderNavigation = () => {
        return (
            <div className={styles.navigation} id="navigation">
                <img src={'/assets/controller/left-bumper.svg'} alt={'prev'} tabIndex={0} role="button" onClick={() => {
                    toggleViewMode('previous')
                }}/>
                {tabs.map(({heading}, index) => (
                    <span key={heading}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                              setTab(index)
                          }}
                          className={tab === index ? styles.navActive : ''}>{heading}</span>
                ))}
                <img src={'/assets/controller/right-bumper.svg'} alt={'next'}
                     tabIndex={0} role="button"
                     onClick={() => {
                         toggleViewMode('next')
                     }}/>
            </div>
        )
    }

    return (
        <div className={styles.wrapperCatalog}>
            <div style={{alignItems: 'start', display: 'grid', gap: 'var(--gap)', gridTemplateColumns: '2fr 3fr'}}>
                {renderCategories()}
                {renderSearch()}
                {renderCollections()}
            </div>
            {renderNavigation()}
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
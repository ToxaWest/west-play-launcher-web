import React from "react";
import { KinozalGameDetails } from "@type/game.types";
import { useParams } from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

import styles from "./downloadGames.module.scss";

const DownloadGameDetails = () => {
    const { id } = useParams();
    const [details, setDetails] = React.useState<KinozalGameDetails | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (id) {
            setLoading(true);
            electronConnector.getKinozalGameDetails(id)
                .then(setDetails)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className={styles.wrapper}><Loader loading={true} /></div>;
    if (!details) return <div className={styles.wrapper}><h1>{i18n.t('Game details not found.')}</h1></div>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.detailsWrapper}>
                <div className={styles.detailsSidebar}>
                    {details.poster && <img src={details.poster} alt="poster" className={styles.detailsPoster} />}
                    {details.downloadLink && (
                        <button onClick={() => electronConnector.kinozalDownloadTorrent(details.downloadLink!)}>
                            {i18n.t('Download')}
                        </button>
                    )}
                </div>
                <div className={styles.detailsContent}>
                    {details.name && <h1>{details.name}</h1>}
                    <div dangerouslySetInnerHTML={{ __html: details.description }} />
                    
                    {details.screenshots && details.screenshots.length > 0 && (
                        <div className={styles.screenshots}>
                            <h2>{i18n.t('Screenshots')}</h2>
                            <div className={styles.screenshotsGrid}>
                                {details.screenshots.map((ss) => (
                                    <img 
                                        key={ss} 
                                        src={ss} 
                                        alt={`screenshot`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DownloadGameDetails;
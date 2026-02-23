import React from "react";
import { KinozalGameDetails } from "@type/game.types";
import { useNavigate,useParams } from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

const DownloadGameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const handleDownload = () => {
        if (details?.downloadLink) {
            electronConnector.kinozalDownloadTorrent(details.downloadLink);
            navigate('/torrent');
        }
    };

    if (loading) return <div className="p-gap w-[90vw] mx-auto min-h-[400px] relative"><Loader loading={true} /></div>;
    if (!details) return <div className="p-gap w-[90vw] mx-auto text-center"><h1>{i18n.t('Game details not found.')}</h1></div>;

    return (
        <div className="p-gap w-[90vw] mx-auto">
            <div className="grid grid-cols-[1fr_2fr] gap-gap items-start">
                <div className="flex flex-col gap-gap sticky top-[50px]">
                    {details.poster && <img src={details.poster} alt="poster" className="w-full rounded-theme shadow-lg" />}
                    {details.downloadLink && (
                        <button onClick={handleDownload} className="w-full text-[20px] font-bold">
                            {i18n.t('Download')}
                        </button>
                    )}
                </div>
                <div className="bbcode flex flex-col gap-gap glass p-theme rounded-theme [&_h1]:text-[24px] [&_h1]:font-bold [&_h1]:mb-gap [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:my-gap [&_p]:mb-gap-half">
                    {details.name && <h1>{details.name}</h1>}
                    <div dangerouslySetInnerHTML={{ __html: details.description }} />
                    
                    {details.screenshots && details.screenshots.length > 0 && (
                        <div className="mt-gap">
                            <h2>{i18n.t('Screenshots')}</h2>
                            <div className="grid grid-cols-2 gap-gap-half">
                                {details.screenshots.map((ss) => (
                                    <img 
                                        key={ss} 
                                        src={ss} 
                                        alt={`screenshot`}
                                        className="w-full rounded-theme"
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
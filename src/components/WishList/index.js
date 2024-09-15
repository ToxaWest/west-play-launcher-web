import CrackWatchList from "../CrackWatchList";
import useWishList from "../../hooks/useWishList";

const WishList = () => {
    const {games} = useWishList()

    return <CrackWatchList games={games} title={`WishList (${games.length})`}/>
}

export default WishList
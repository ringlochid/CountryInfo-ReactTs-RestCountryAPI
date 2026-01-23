import { CardContainer } from "../components/CardContainer";
import { SearchContainer } from "../components/SearchContainer";

export function HomePage() {
    return (
        <main>
            <SearchContainer />
            <CardContainer />
        </main>
    )
}
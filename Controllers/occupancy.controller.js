import { API_KEY, ERROR_STATUS } from "../constant.js";

const createAirbnbReviewAPIRoute = (
    id,
    limit,
    offset,
    locale = "en-IN",
    currency = "INR"
) => {
    return `https://www.airbnb.com/api/v3/StaysPdpReviewsQuery/dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d?operationName=StaysPdpReviewsQuery&locale=${locale}&currency=${currency}&variables=%7B%22id%22%3A%22${id}%22%2C%22pdpReviewsRequest%22%3A%7B%22fieldSelector%22%3A%22for_p3_translation_only%22%2C%22forPreview%22%3Afalse%2C%22limit%22%3A${limit}%2C%22offset%22%3A%22${offset}%22%2C%22showingTranslationButton%22%3Afalse%2C%22first%22%3A${limit}%2C%22sortingPreference%22%3A%22MOST_RECENT%22%2C%22numberOfAdults%22%3A%221%22%2C%22numberOfChildren%22%3A%220%22%2C%22numberOfInfants%22%3A%220%22%2C%22numberOfPets%22%3A%220%22%2C%22after%22%3Anull%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d%22%7D%7D`;
};

export async function getOccupancyForNext5Months(req, res) {
    const { room_id } = req.params;
    let id = btoa(room_id);
    let limit = 30, offset = 0;

    let curDate = new Date();
    let lastReview, arraySize = 0;

    const noOfReviewsEveryMonth = Array.from({ length: 12 }, () => 0);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    try {
        do {
            const apiRoute = createAirbnbReviewAPIRoute("U3RheUxpc3Rpbmc6" + id, limit, offset);
            console.log("Fetching data from API:", apiRoute);
            
            const result = await fetch(apiRoute, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Airbnb-Api-Key": API_KEY,
                    "Referer": `https://www.airbnb.co.in/rooms/${room_id}/reviews?source_impression_id=p3_1726225129_P3XwRp7ZARTg48F2`,
                    "Device-Memory": "8",
                    "DNT": "1",
                    "DPR": "1",
                    "ECT": "4g",
                    "Sec-CH-UA": `"Not;A=Brand";v="24", "Chromium";v="128"`,
                    "Sec-CH-UA-Mobile": "?0",
                    "Sec-CH-UA-Platform": `"macOS"`,
                    "Sec-CH-UA-Platform-Version": `"14.5.0"`,
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                    "Viewport-Width": "1420",
                    "X-Airbnb-GraphQL-Platform": "web",
                    "X-Airbnb-GraphQL-Platform-Client": "minimalist-niobe",
                    "X-Airbnb-Supports-Airlock-V2": "true",
                    "X-Client-Request-Id": "0rgl7xf13zu91j0x620oq1hg0awk",
                    "X-Client-Version": "711f014e5082aad7a08357f79d501e15810c8363",
                    "X-CSRF-Token": "",
                    "X-CSRF-Without-Token": "1",
                    "X-Niobe-Short-Circuited": "true"
                  }
            });
            
            if (!result.ok) {
                const { status, statusText, headers, url } = result;
                const { server, 'content-type': contentType, 'x-reference-error': referenceError } = headers;
                
                console.log(`Status: ${status}`);
                console.log(`Status Text: ${statusText}`);
                console.log(`Server: ${server}`);
                console.log(`Content Type: ${contentType}`);
                console.log(`Reference Error: ${referenceError}`);
                console.log(`URL: ${url}`);
                throw new Error(`API request failed with status ${result.status} and message ${result.message}`);
            }
            
            const finalResult = await result.json();
            console.log(finalResult)
            const arrayOfReviews = finalResult?.data?.presentation?.stayProductDetailPage?.reviews?.reviews;
            
            if (!arrayOfReviews) {
                throw new Error("No reviews found in the response");
            }

            arrayOfReviews.map((reviews) => {
                const date = new Date(reviews.createdAt);
                ++noOfReviewsEveryMonth[date.getMonth()];
                console.log("Processed review date month:", date.getMonth());
            });

            offset += limit;
            arraySize = arrayOfReviews.length;
            lastReview = new Date(arrayOfReviews[arraySize - 1].createdAt);
        } while (arraySize === 30 && !(lastReview.getMonth() === curDate.getMonth() && lastReview.getFullYear() !== curDate.getFullYear()));

        // Calculate occupancy for the next 5 months
        const nextFiveMonths = [];
        for (let i = 0; i < 5; i++) {
            let monthIndex = (curDate.getMonth() + i) % 12;
            nextFiveMonths.push({
                month: months[monthIndex],
                occupancy: (noOfReviewsEveryMonth[monthIndex] / 12).toFixed(2),
            });
        }

        console.log("Occupancy data for next 5 months:", nextFiveMonths);
        res.json(nextFiveMonths);

    } catch (error) {
        console.error("Error calculating occupancy:", error.message);
        res.status(500).json({ error: "something went wrong while calculating occupancy" });
    }
}


import { API_KEY } from "../constant.js";

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
    let limit = 50, offset = 0;

    let check = false;
    let curDate = new Date();
    let lastReview, arraySize = 0;

    const noOfReviewsEveryMonth = Array.from({ length: 12 }, () => 0);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    do {
        const apiRoute = createAirbnbReviewAPIRoute("U3RheUxpc3Rpbmc6" + id, limit, offset);
        const result = await fetch(apiRoute, {
            method: "GET",
            headers: {
                "X-Airbnb-Api-Key": API_KEY,
            },
        });

        const finalResult = await result.json();
        const arrayOfReviews = finalResult.data.presentation.stayProductDetailPage.reviews.reviews;

        check = false;
        arraySize = arrayOfReviews.length;
        lastReview = new Date(arrayOfReviews[arraySize - 1].createdAt);

        if(lastReview.getMonth() === curDate.getMonth() && lastReview.getFullYear() !== curDate.getFullYear()) check = true;

        arrayOfReviews.map((reviews) => {
            const date = new Date(reviews.createdAt);

            if(check && !(date.getMonth() === curDate.getMonth() && lastReview.getFullYear() !== date.getFullYear())) {

            }
            else {
                // console.log(months[date.getMonth()]);
                ++noOfReviewsEveryMonth[date.getMonth()];
            }
        });

        offset += limit;
    } while (arraySize === 50 && !check);

    let occupancyForNext5Months = {};
    const avgReviewsEveryMonth = noOfReviewsEveryMonth.map(value => value / 30);

    const sum = noOfReviewsEveryMonth.reduce((acc, curr) => acc + curr, 0);
    const avgOccupancy = Math.round(sum / 12);


    for (let i = 1; i < 6; i++) {
        let nextMonthIndex = (curDate.getMonth() + i) % 12;

        if(noOfReviewsEveryMonth[nextMonthIndex]) 
            occupancyForNext5Months[months[nextMonthIndex]] = avgReviewsEveryMonth[nextMonthIndex] >= 1 ? "100%" : 
                Number((avgReviewsEveryMonth[nextMonthIndex] * 100).toFixed(2)) + "%";

        else 
        occupancyForNext5Months[months[nextMonthIndex]] = Number(avgOccupancy.toFixed(2)) + "%";
    }

    res.json(occupancyForNext5Months);
}

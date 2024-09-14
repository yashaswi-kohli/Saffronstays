import { API_KEY, ERROR_STATUS } from "../constant.js";

const createAirbnbReviewAPIRoute = (
    id,
    limit,
    offset,
    locale = "en-IN",
    currency = "INR"
) => {
    return `api/v3/StaysPdpReviewsQuery/dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d?operationName=StaysPdpReviewsQuery&locale=${locale}&currency=${currency}&variables=%7B%22id%22%3A%22${id}%22%2C%22pdpReviewsRequest%22%3A%7B%22fieldSelector%22%3A%22for_p3_translation_only%22%2C%22forPreview%22%3Afalse%2C%22limit%22%3A${limit}%2C%22offset%22%3A%22${offset}%22%2C%22showingTranslationButton%22%3Afalse%2C%22first%22%3A${limit}%2C%22sortingPreference%22%3A%22MOST_RECENT%22%2C%22numberOfAdults%22%3A%221%22%2C%22numberOfChildren%22%3A%220%22%2C%22numberOfInfants%22%3A%220%22%2C%22numberOfPets%22%3A%220%22%2C%22after%22%3Anull%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d%22%7D%7D`;
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
                    ":authority": "www.airbnb.co.in",
                    ":method": "GET",
                    ":path": "https://www.airbnb.com/" + apiRoute,
                    ":scheme": "https",
                    "accept": "*/*",
                    "accept-encoding": "gzip, deflate, br, zstd",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "content-type": "application/json",
                    "cookie": `cdn_exp_0752821c603ff621a=control; cdn_exp_6de452700098fbf87=control; li=1; everest_cookie=1726162203.EAMGQwYmRkYjMzY2YzMz.EmOS0CPlPmmlv_LyiPSZ1ZLz0BS71JV6VVB3p4VC4KU; bev=1726162203_EAZTRlYzJhNjIzOD; _ccv=cban%3A0_183215%3D1%2C0_200000%3D1%2C0_183345%3D1%2C0_183243%3D1%2C0_183216%3D1%2C0_179751%3D1%2C0_200003%3D1%2C0_200005%3D1%2C0_179754%3D1%2C0_179750%3D1%2C0_179737%3D1%2C0_179744%3D1%2C0_179739%3D1%2C0_179743%3D1%2C0_179749%3D1%2C0_200012%3D1%2C0_200011%3D1%2C0_183217%3D1%2C0_183219%3D1%2C0_183096%3D1%2C0_179747%3D1%2C0_179740%3D1%2C0_179752%3D1%2C0_183241%3D1%2C0_200007%3D1%2C0_183346%3D1%2C0_183095%3D1%2C0_210000%3D1%2C0_210001%3D1%2C0_210002%3D1%2C0_210003%3D1%2C0_210004%3D1%2C0_210010%3D1; tzo=330; previousTab=%7B%22id%22%3A%22b6763c25-ab0e-434d-9fb9-e11a7494c8bb%22%7D; cfrmfctr=DESKTOP; cbkp=3; frmfctr=wide; previousTab=%7B%22id%22%3A%22797de706-702b-46cc-9c27-37d34f5df0f8%22%7D; jitney_client_session_id=3a9c9237-0581-4036-91d8-610810007bfc; jitney_client_session_created_at=1726308211.625; ak_bmsc=EBAC26E5B035760CB6EA4FA43E86F464~000000000000000000000000000000~YAAQi7YRYEXnyuWRAQAADdz87xnlKMlTF6PNFYGCicSTGsvKo9rjI2VGcnRefBuBiyZoiOHS5PALT1CfwvhCaUwWvuXFrEn+ksjl+jg4TiLXgGqSOoHgVUTgzwOIpz4FPSts4fK+SA1JuG+UVM6QRi7c5IFBw60cVadSi+kCsfNIundHAbD23WDdchGhOV2+4zvTRJ6M1PFjhqLssncFEv95mITcgBADVcc2xWSixQaFEyIwlQ1QfX43pkDUl5XjsIP2QPQOZN/pmWpyM59XRk7LHmFFDrdOfvxMJ7vB5RwrEjcJ97dYuO6zRb6K0szrkau5g+pS/Pu/mcF22S2l/jMeIrnN20Ffjt+/HEpBQq7XiXY2DcSGhlyhd0BFQaQzO8F1ddUyQUV/vJwmWw==; jitney_client_session_id=68e0674b-e11a-4f9d-8c17-4d138b90f16b; jitney_client_session_created_at=1726308212; _user_attributes=%7B%22device_profiling_session_id%22%3A%221726162434--a6cd5bd07dac25f4fdea7612%22%2C%22giftcard_profiling_session_id%22%3A%221726308217--a6048ff793f477d37d33a9c3%22%2C%22reservation_profiling_session_id%22%3A%221726308217--1ef10f31f11c4b52d3046bb1%22%2C%22curr%22%3A%22INR%22%7D; OptanonConsent=0_179750%3A1%2C0_183095%3A1%2C0_183217%3A1%2C0_210000%3A1; bm_sv=CFD74683071395CB6E63789B013CA905~YAAQi7YRYGnyyuWRAQAADdz87xA5pOATfN5wnEYP3yAhPzHdzT5Q2Q2pgb9lZAP6U+m4KRHSXc34aDIhlf5WyznWJGqztgL5PTDWGpGujmwN7CGey+Gu/3Dq9VNiGtYfxqxGsDVi0FlghRNfPstBIHTN4Zy5MbS10XsgsAYAh6E4D31AX+gJeYoCAZh2uQ==; jitney_client_session_created_at=1726308214; jitney_client_session_id=b1c29571-d46d-4736-8ecf-d0ac1736d7b6`,
                    "device-memory": "8",
                    "dnt": "1",
                    "dpr": "1",
                    "ect": "4g",
                    "referer": `https://www.airbnb.co.in/rooms/${room_id}?source_impression_id=p3_1726225129_P3XwRp7ZARTg48F2&guests=1&adults=1`,
                    "sec-ch-ua": `"Not;A=Brand";v="24", "Chromium";v="128"`,
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": `"macOS"`,
                    "sec-ch-ua-platform-version": `"14.5.0"`,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                    "viewport-width": "1420",
                    "x-airbnb-api-key": API_KEY,
                    "x-airbnb-graphql-platform": "web",
                    "x-airbnb-graphql-platform-client": "minimalist-niobe",
                    "x-airbnb-supports-airlock-v2": "true",
                    "x-client-request-id": "0rgl7xf13zu91j0x620oq1hg0awk",
                    "x-client-version": "711f014e5082aad7a08357f79d501e15810c8363",
                    "x-csrf-token": "",
                    "x-csrf-without-token": "1",
                    "x-niobe-short-circuited": "true"
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


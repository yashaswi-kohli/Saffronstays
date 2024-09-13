import { API_KEY } from "../constant.js";

const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const convertCurrencyToNumber = (currencyString) => {
    const cleanedString = currencyString.replace(/₹|,/g, '');
    const numberValue = parseFloat(cleanedString);
    return numberValue;
};

const createAirbnbBookingAPIRoute = (
    id,
    checkIn,
    checkOut,
    p3ImpressionId = "p3_1726233071_P3V2FPKN5NZIy9PM",
    locale = "en-IN",
    currency = "INR"
) => {
    return `https://www.airbnb.co.in/api/v3/StaysPdpSections/38218432c2d53194baa9c592ddd8e664cffcbcac58f0e118e8c1680eb9d58da7?operationName=StaysPdpSections&locale=${locale}&currency=${currency}&variables=%7B%22id%22%3A%22${id}%22%2C%22pdpSectionsRequest%22%3A%7B%22adults%22%3A%221%22%2C%22amenityFilters%22%3Anull%2C%22bypassTargetings%22%3Afalse%2C%22categoryTag%22%3Anull%2C%22causeId%22%3Anull%2C%22children%22%3Anull%2C%22disasterId%22%3Anull%2C%22discountedGuestFeeVersion%22%3Anull%2C%22displayExtensions%22%3Anull%2C%22federatedSearchId%22%3Anull%2C%22forceBoostPriorityMessageType%22%3Anull%2C%22hostPreview%22%3Afalse%2C%22infants%22%3Anull%2C%22interactionType%22%3Anull%2C%22layouts%22%3A%5B%22SIDEBAR%22%2C%22SINGLE_COLUMN%22%5D%2C%22pets%22%3A0%2C%22pdpTypeOverride%22%3Anull%2C%22photoId%22%3Anull%2C%22preview%22%3Afalse%2C%22previousStateCheckIn%22%3Anull%2C%22previousStateCheckOut%22%3Anull%2C%22priceDropSource%22%3Anull%2C%22privateBooking%22%3Afalse%2C%22promotionUuid%22%3Anull%2C%22relaxedAmenityIds%22%3Anull%2C%22searchId%22%3Anull%2C%22selectedCancellationPolicyId%22%3Anull%2C%22selectedRatePlanId%22%3Anull%2C%22splitStays%22%3Anull%2C%22staysBookingMigrationEnabled%22%3Afalse%2C%22translateUgc%22%3Anull%2C%22useNewSectionWrapperApi%22%3Afalse%2C%22sectionIds%22%3A%5B%22BOOK_IT_FLOATING_FOOTER%22%2C%22EDUCATION_FOOTER_BANNER_MODAL%22%2C%22POLICIES_DEFAULT%22%2C%22BOOK_IT_CALENDAR_SHEET%22%2C%22BOOK_IT_SIDEBAR%22%2C%22URGENCY_COMMITMENT_SIDEBAR%22%2C%22BOOK_IT_NAV%22%2C%22MESSAGE_BANNER%22%2C%22HIGHLIGHTS_DEFAULT%22%2C%22EDUCATION_FOOTER_BANNER%22%2C%22URGENCY_COMMITMENT%22%2C%22CANCELLATION_POLICY_PICKER_MODAL%22%5D%2C%22checkIn%22%3A%22${checkIn}%22%2C%22checkOut%22%3A%22${checkOut}%22%2C%22p3ImpressionId%22%3A%22${p3ImpressionId}%22%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2238218432c2d53194baa9c592ddd8e664cffcbcac58f0e118e8c1680eb9d58da7%22%7D%7D`;
};

export async function getPriceForNext30Days(req, res) {

    const { room_id } = req.params;

    let sum = 0;
    const prices = [];

    let id = btoa(room_id);
    let today = new Date();

    for (let i = 1; i < 31; i++) {
        let checkIn = new Date(), checkOut = new Date();

        checkIn.setDate(today.getDate() + i);
        checkOut.setDate(today.getDate() + i + 1);
        const apiRoute = createAirbnbBookingAPIRoute("U3RheUxpc3Rpbmc6" + id, getFormattedDate(checkIn), getFormattedDate(checkOut));


        const result = await fetch(apiRoute, {
            method: "GET",
            headers: {
                "X-Airbnb-Api-Key": API_KEY,
            },
        });
        const finalResult = await result.json();
        const stringAmount = finalResult?.data?.presentation?.stayProductDetailPage?.sections?.sections[0]?.section?.structuredDisplayPrice?.explanationData?.priceDetails[1]?.items[0].priceString;

        // console.log(checkIn.getDate(), checkOut.getDate(), stringAmount);

        if(stringAmount) {
            const priceInNumber = convertCurrencyToNumber(stringAmount);
            sum += priceInNumber;
            prices.push(priceInNumber);
        }
    }

    res.json({
        rates: {
            lowest: Math.min(...prices),
            highest: Math.max(...prices),
            avgerage: Math.round(sum / prices.length),
        }
    });
}

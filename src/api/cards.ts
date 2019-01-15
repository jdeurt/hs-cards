import got from "got";
import { Request, Response } from "express";
import { HSCard } from "../types/card";
import cfg from "./config";
import filterTypes from "./modules";


//hearthstone
//https://hearthstonejson.com/docs/images.html
export default async function(req: Request, res: Response) {
    try {
        // Cache control for card data.
        if (!process.env.hs_cards_data_json) {
            let data = await got("https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json", {
                json: true
            });

            process.env.hs_cards_data_json = JSON.stringify(data.body);
        }

        // Grab card data from env variable.
        let cards = JSON.parse(process.env.hs_cards_data_json);

        let filters = req.query;

        for (let filter in filters) {
            if (cfg.ALIASES[filter]) {
                let oldFilter = filter;
                filter = cfg.ALIASES[oldFilter];
                filters[filter] = filters[oldFilter];
            }

            cards = cards.filter((card: HSCard) => {
                // Custom rule for "r" filter.
                if (filter == "r") return true;
                // Custom rule for "standard" filter.
                if (filter == "standard") return true;

                // If the filter isn't a property of the card object and some unknown shit, end the check here.
                if (!card[filter] && !filters[filter].includes("|")) return false;

                // The card property content.
                let cardProp = card[filter];
                // The filter content.
                let checkProp = filters[filter];
                // Will be used if the pipe is present in checkProp.
                let multipleCheckProps: string[] = [];

                // If the checkProp includes pipes, split it up into multiple properties.
                if (checkProp.includes("|")) {
                    multipleCheckProps = checkProp.split("|");
                }

                if (typeof cardProp == "string") {
                    return filterTypes.string(multipleCheckProps, checkProp, cardProp);
                } else if (Array.isArray(cardProp)) {
                    return filterTypes.array(multipleCheckProps, checkProp, cardProp);
                } else if (typeof cardProp == "number") {
                    return filterTypes.number(multipleCheckProps, checkProp, cardProp);
                } else {
                    return filterTypes.boolean(multipleCheckProps, checkProp, cardProp);
                }
            });
        }

        // Handle custom filters.
        if (filters.standard) {
            cards = cards.filter((card: HSCard) => {
                return !cfg.WILD_SETS.includes(card.set);
            });
        }

        if (filters.r) {
            if (filters.r.endsWith("__PLAIN")) {
                filters.r = filters.r.replace("__PLAIN", "");

                cards = cards.filter((card: HSCard) => {
                    return !!card[filters.r];
                });

                res.json(cards.map((card: HSCard) => {
                    return card[filters.r];
                }).join(","));
            } else {
                cards = cards.filter((card: HSCard) => {
                    return !!card[filters.r];
                });
    
                res.json(cards.map((card: HSCard) => {
                    return card[filters.r];
                }));
            }
        } else {
            res.json(cards);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Process aborted unexpectedly."
        });
    }
}
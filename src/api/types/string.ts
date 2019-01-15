export default function(multipleCheckProps: string[], checkProp: string, cardProp: string) {
    if (multipleCheckProps) {
        let valid = false;
        multipleCheckProps.forEach(checkProp => {
            if (checkProp.startsWith("~")) {
                valid = valid || (
                    cardProp
                    .toLowerCase()
                    .replace(/\[x\]|<b>|<\/b>|<i>|<\/i>|<i>|<\/i>/g, "")
                    .replace(/\n/g, " ")
                    .includes(
                        checkProp
                        .slice(1)
                        .toLowerCase()
                    )
                );
            }

            valid = valid || (
                cardProp
                .toLowerCase()
                .replace(/\[x\]|<b>|<\/b>|<i>|<\/i>/g, "")
                .replace(/\n/g, " ") ==
                checkProp.toLowerCase()
            );
        });

        return valid;
    }

    if (checkProp.startsWith("~")) {
        return (
            cardProp
            .toLowerCase()
            .replace(/\[x\]|<b>|<\/b>|<i>|<\/i>/g, "")
            .replace(/\n/g, " ")
            .includes(
                checkProp
                .slice(1)
                .toLowerCase()
            )
        );
    }

    let isRegex = checkProp.match(/^\/.+\/[a-zA-Z]*$/);
    if (isRegex) {
        try {
            //@ts-ignore
            let str = checkProp.match(/(?<=\/).+(?=\/)/g)[0];
            //@ts-ignore
            let flags = checkProp.match(/\/[a-zA-Z]*$/g)[0].slice(1);
            new RegExp(str, flags);
        } catch (err) {
            //@ts-ignore
            isRegex = false;
        }
    }

    if (isRegex) {
        //@ts-ignore
        let str = checkProp.match(/(?<=\/).+(?=\/)/g)[0];
        //@ts-ignore
        let flags = checkProp.match(/\/[a-zA-Z]*$/g)[0].slice(1);
        return !!cardProp.match(new RegExp(str, flags));
    }

    return (
        cardProp
        .toLowerCase()
        .replace(/\[x\]|<b>|<\/b>|<i>|<\/i>/g, "")
        .replace(/\n/g, " ") ==
        checkProp.toLowerCase()
    );
};
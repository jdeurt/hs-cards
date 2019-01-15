export default function(multipleCheckProps: string[], checkProp: string, cardProp: number) {
    if (multipleCheckProps) {
        let valid = false;
        multipleCheckProps.forEach(checkProp => {
            if (checkProp.startsWith(">=")) {
                checkProp = checkProp.slice(2);
                let num = parseInt(checkProp);

                valid = valid || (cardProp >= num);
            } else if (checkProp.startsWith("<=")) {
                checkProp = checkProp.slice(2);
                let num = parseInt(checkProp);

                valid = valid || (cardProp <= num);
            } else if (checkProp.startsWith(">")) {
                checkProp = checkProp.slice(1);
                let num = parseInt(checkProp);

                valid = valid || (cardProp > num);
            } else if (checkProp.startsWith("<")) {
                checkProp = checkProp.slice(1);
                let num = parseInt(checkProp);

                valid = valid || (cardProp < num);
            } else if (checkProp.match(/^\d+~/g)) {
                let differentialStr = (checkProp.match(/^\d+(?=~\d+$)/g) || ["0"])[0];
                let differential = parseInt(differentialStr);

                checkProp = (checkProp.match(/(?<=^\d+~)\d+$/g) || ["0"])[0];
                let num = parseInt(checkProp);

                valid = valid || (cardProp >= num - differential && cardProp <= num + differential);
            } else {
                let num = parseInt(checkProp);

                valid = valid || (cardProp == num);
            }
        })

        return valid;
    }

    if (checkProp.startsWith(">=")) {
        checkProp = checkProp.slice(2);
        let num = parseInt(checkProp);

        return (cardProp >= num);
    } else if (checkProp.startsWith("<=")) {
        checkProp = checkProp.slice(2);
        let num = parseInt(checkProp);

        return (cardProp <= num);
    } else if (checkProp.startsWith(">")) {
        checkProp = checkProp.slice(1);
        let num = parseInt(checkProp);

        return (cardProp > num)
    } else if (checkProp.startsWith("<")) {
        checkProp = checkProp.slice(1);
        let num = parseInt(checkProp);

        return (cardProp < num);
    } else if (checkProp.match(/^\d+~/g)) {
        let differentialStr = (checkProp.match(/^\d+(?=~\d+$)/g) || ["0"])[0];
        let differential = parseInt(differentialStr);

        checkProp = (checkProp.match(/(?<=^\d+~)\d+$/g) || ["0"])[0];
        let num = parseInt(checkProp);

        return (cardProp >= num - differential && cardProp <= num + differential);
    } else {
        let num = parseInt(checkProp);

        return (cardProp == num);
    }
};
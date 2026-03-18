/* 
+-------------------------------------------------------+
| Rajarshi Das                                          |
+-------------------------------------------------------+
| Created On: 11-May-2024                               |
| Updated On: 04-Jan-2026                               |
+-------------------------------------------------------+
*/


/*
+---------------------------------------------------------------------------+
| https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch    |
+---------------------------------------------------------------------------+
| Example POST method implementation:                                       |
+---------------------------------------------------------------------------+
async function bdFetchAPI(url = "", formData = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        //headers: {
        // "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        //},
        redirect: "error", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //body: JSON.stringify(data), // body data type must match "Content-Type" header
        body: formData, // RD - use FormData
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
*/

async function bdFetchAPI(url = "", formData = new FormData()) {
    const response = await fetch(url, {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "error",
        referrerPolicy: "no-referrer",
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}

/* Howto use bdFetchAPI function
+---------------------------------------------------------------------------+
| https://developer.mozilla.org/en-US/docs/Web/API/FormData                 |
+---------------------------------------------------------------------------+

const apiUrl = "<?= $base_url ?>index.php";
var formData = new FormData()
formData.append("a", "tasks-api-fetchProjectData")

bdFetchAPI(apiUrl,formData).then((response) => {
    console.log(response);
});
*/

/*
+---------------------------------------------------------------------------+
| Get element by Id                                                         |
+---------------------------------------------------------------------------+
*/
function e$(eid) {
    return document.getElementById(eid)
}

function dxClose(dxId) {
    e$(dxId).close()
}

function rx(log) {
    console.log(log)
}

function formatIsoDateToHuman(isoDateStr) {
    const date = new Date(isoDateStr);

    const day = String(date.getDate()).padStart(2, '0');
    const monthShort = date.toLocaleString('en-US', { month: 'short' }); // "Jun"
    const year = String(date.getFullYear()).slice(-2); // "25"

    return `${day}-${monthShort}-${year}`;
}

/*
+---------------------------------------------------------------------------+
| Data Validation | 22-Dec-2025 ChatGPT                                     |
+---------------------------------------------------------------------------+
*/
const bdValidate = {

    /* ===============================
       BASIC CHECKS
    =============================== */

    isRequired(value) {
        return value !== null &&
            value !== undefined &&
            String(value).trim() !== "";
    },

    isString(value, min = 0, max = Infinity) {
        if (!this.isRequired(value)) return false;
        return typeof value === "string" &&
            value.length >= min &&
            value.length <= max;
    },

    isAlpha(value) {
        return /^[A-Za-z]+$/.test(value);
    },

    isAlphaNumeric(value) {
        return /^[A-Za-z0-9]+$/.test(value);
    },

    isAlphaNumericDot(value) {
        return /^[A-Za-z0-9.]+$/.test(value);
    },

    /* ===============================
       NUMBER VALIDATION
    =============================== */

    isNumber(value) {
        return Number.isFinite(Number(value));
    },

    isNonEmptyNonNegativeNumber(value) {
        if (!this.isRequired(value)) return false;
        const num = Number(value);
        return Number.isFinite(num) && num >= 0;
    },

    isPositiveNumber(value) {
        if (!this.isRequired(value)) return false;
        const num = Number(value);
        return Number.isFinite(num) && num >= 0;
    },

    isInteger(value) {
        return Number.isInteger(Number(value));
    },

    isInRange(value, min, max) {
        if (!this.isNumber(value)) return false;
        const num = Number(value);
        return num >= min && num <= max;
    },

    /* ===============================
       DATE VALIDATION
    =============================== */

    isValidISODate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

        const [y, m, d] = value.split("-").map(Number);
        const date = new Date(y, m - 1, d);

        return (
            date.getFullYear() === y &&
            date.getMonth() === m - 1 &&
            date.getDate() === d
        );
    },

    isPastDate(value) {
        if (!this.isValidISODate(value)) return false;
        return new Date(value) < new Date();
    },

    isFutureDate(value) {
        if (!this.isValidISODate(value)) return false;
        return new Date(value) > new Date();
    },

    /* ===============================
       EMAIL / PHONE
    =============================== */

    isEmail(value) {
        if (!this.isRequired(value)) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    isPhone(value, min = 10, max = 15) {
        if (!this.isRequired(value)) return false;
        return /^[0-9]+$/.test(value) &&
            value.length >= min &&
            value.length <= max;
    },

    /* ===============================
       PASSWORD
    =============================== */

    isStrongPassword(value, minLen = 8) {
        if (!this.isRequired(value)) return false;
        return new RegExp(
            `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{${minLen},}$`
        ).test(value);
    },

    /* ===============================
       URL
    =============================== */

    isURL(value) {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }
};

/*
+-------------------------------------------------------+
| Passwd strength | 22-Jan-26                           |
+-------------------------------------------------------+
*/

/* 
Example: Live input feedback
Note: Server side validation available in Toolkit/Validation.php

<input type="password" id="password" />
<div id="feedback"></div>

<script>
const input = document.getElementById("password");
const feedback = document.getElementById("feedback");

input.addEventListener("input", () => {
  const errors = checkPassword(input.value);
  feedback.innerHTML = errors.length
    ? errors.map(e => "❌ " + e).join("<br>")
    : "✅ Strong password";
});
</script>
*/

function checkPassword(password) {
    const errors = [];

    if (password.length < 8)
        errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password))
        errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password))
        errors.push("At least one lowercase letter");
    if (!/[0-9]/.test(password))
        errors.push("At least one number");
    if (!/[\W_]/.test(password))
        errors.push("At least one special character");

    return errors;
}


/* 
+---------------------------------------------------------------+
| Tooltip | 07-Feb-26                                           |
| <div class="tx" data-title="Friend's Marriage">02</div>       |
+---------------------------------------------------------------+
*/

let tooltip;

document.addEventListener('mouseover', e => {
    const el = e.target.closest('.tx[data-title]');
    if (!el) return;

    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = el.dataset.title;
    document.body.appendChild(tooltip);

    const rect = el.getBoundingClientRect();
    const tRect = tooltip.getBoundingClientRect();

    let top = rect.top - tRect.height - 8;
    let left = rect.left + rect.width / 2 - tRect.width / 2;

    /* flip if offscreen */
    if (top < 0) {
        top = rect.bottom + 8;
        tooltip.style.transform = 'rotate(180deg)';
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${Math.max(8, left)}px`;
    tooltip.classList.add('show');
});

document.addEventListener('mouseout', e => {
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
});


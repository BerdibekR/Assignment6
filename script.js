const initialRooms = [
    {
        name: "Balcony", floor: 2, guests: [
            { name: "Aigerim", color: "green", time: "20:45", aitu: true, things: ["cup", "crumbs"] },
            { name: "Aliya", color: "black", time: "21:15", aitu: false, things: ["phone", "cup"] },
            { name: "Madina", color: "green", time: "22:10", aitu: false, things: ["phone", "bag", "crumbs"] },
            { name: "Ivan", color: "black", time: "20:10", aitu: true, things: ["cup"] }
        ]
    },
    {
        name: "Hall", floor: 2, guests: [
            { name: "Arman", color: "yellow", time: "20:35", aitu: false, things: ["bag", "glasses"] },
            { name: "Sophia", color: "purple", time: "21:20", aitu: true, things: ["phone"] },
            { name: "Dias", color: "green", time: "19:45", aitu: true, things: [] },
            { name: "Bekzat", color: "purple", time: "20:55", aitu: false, things: ["bag", "cup", "crumbs"] },
            { name: "Aruzhan", color: "blue", time: "21:50", aitu: true, things: ["phone"] },
            { name: "Saule", color: "green", time: "21:25", aitu: false, things: ["glasses"] }
        ]
    },
    {
        name: "Kitchen", floor: 1, guests: [
            { name: "Nurlan", color: "red", time: "19:40", aitu: true, things: ["phone", "cup"] },
            { name: "Emma", color: "black", time: "20:15", aitu: false, things: ["bag"] },
            { name: "Timur", color: "green", time: "21:05", aitu: true, things: ["phone", "bag", "crumbs"] },
            { name: "Sergey", color: "yellow", time: "20:50", aitu: false, things: [] },
            { name: "Yerlan", color: "red", time: "21:40", aitu: true, things: ["glasses", "phone"] },
            { name: "Kamila", color: "green", time: "20:05", aitu: false, things: ["cup"] }
        ]
    },
    {
        name: "Living room", floor: 1, guests: [
            { name: "Daniel", color: "blue", time: "19:55", aitu: true, things: ["glasses"] },
            { name: "Zarina", color: "green", time: "21:10", aitu: false, things: ["bag", "phone", "crumbs"] },
            { name: "Natasha", color: "yellow", time: "20:30", aitu: true, things: [] },
            { name: "Askar", color: "black", time: "21:00", aitu: true, things: ["phone"] },
            { name: "Inkar", color: "purple", time: "20:20", aitu: false, things: ["bag"] }
        ]
    }
];

let rooms = structuredClone(initialRooms);
let openGuest = null;

const iconMap = { phone: "☎", glasses: "◎", bag: "▣", cup: "☕", crumbs: "✦" };

const cases = [
    "Who is in the hall?",
    "Who is dressed in yellow or purple?",
    "Which AITU students are upstairs?",
    "Who has glasses or a bag?",
    "Who came with nothing at all?",
    "Who has a phone but no bag?",
    "Who arrived between 20:30 and 21:00?",
    "Who arrived after 21:00 and is not an AITU student?",
    "Who stands right next to Askar?",
    "Who stands last in each room?",
    "Who stands third in each room?",
    "Who stands after Timur in his room?",
    "Who stands right before someone in black?",
    "In which room is Aruzhan?",
    "Which rooms have fewer than 6 guests?",
    "Rooms with a cup but nobody wearing glasses?",
    "Who came first to each room?",
    "Miras joins Askar and Inkar.",
    "Natasha leaves the party.",
    "Who took the cake?"
];

function allCards() {
    return $(".guest-card");
}

function getRoom(name) {
    return rooms.find(r => r.name === name);
}

const femaleNames = ["Aigerim", "Aliya", "Madina", "Sophia", "Aruzhan", "Saule", "Emma", "Kamila", "Zarina", "Natasha", "Inkar"];

function avatarUrl(name) {
    return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(name)}`;
}

function guestCard(g) {
    const things = g.things.map(t => iconMap[t]).join(" ") || "—";
    return $(`<article class="guest-card guest-${g.name.toLowerCase()} color-${g.color} ${g.aitu ? "aitu" : "non-aitu"}" tabindex="0" data-name="${g.name}" data-color="${g.color}" data-time="${g.time}" data-aitu="${g.aitu}" data-things="${g.things.join(",")}" style="--guest-color:${g.color}">
        <img class="avatar" src="${avatarUrl(g.name)}" alt="${g.name}">
        <div class="guest-name">${g.name}</div>
        <div class="guest-time">${g.time}</div>
        <div class="guest-things">${things}</div>
        ${g.aitu ? '<span class="aitu-badge">AITU</span>' : ""}
    </article>`);
}

function renderParty() {
    rooms.forEach(room => {
        const list = $(document.getElementById("room-" + room.name));
        list.empty();
        room.guests.forEach(g => list.append(guestCard(g)));
    });
}

function buildCases() {
    cases.forEach((label, i) => {
        $("#caseButtons").append(`<button class="case-button" data-case="${i + 1}"><span class="case-number">CASE ${String(i + 1).padStart(2, "0")}</span>${label}</button>`);
    });
}

function cardByName(name) {
    return allCards().filter(function () {
        return $(this).attr("data-name") === name;
    });
}

function chainCase(n) {
    const $cards = allCards();

    switch (n) {
        case 1:
            return $("#room-Hall .guest-card");

        case 2:
            return $cards.filter('[data-color="yellow"], [data-color="purple"]');

        case 3:
            return $cards.filter('[data-aitu="true"]').filter(function () {
                return $(this).closest(".room").parent().attr("id") === "floor2";
            });

        case 4:
            return $cards.filter(function () {
                const t = ($(this).attr("data-things") || "").split(",");
                return t.includes("glasses") || t.includes("bag");
            });

        case 5:
            return $cards.filter('[data-things=""]');

        case 6:
            return $cards.filter(function () {
                const t = ($(this).attr("data-things") || "").split(",");
                return t.includes("phone") && !t.includes("bag");
            });

        case 7:
            return $cards.filter(function () {
                const t = $(this).attr("data-time");
                return t >= "20:30" && t <= "21:00";
            });

        case 8:
            return $cards.filter('[data-aitu="false"]').filter(function () {
                return $(this).attr("data-time") > "21:00";
            });

        case 9: {
            const $askar = cardByName("Askar");
            return $askar.prev(".guest-card").add($askar.next(".guest-card"));
        }

        case 10:
            return $cards.filter(":last-child");

        case 11:
            return $cards.filter(":nth-child(3)");

        case 12:
            return cardByName("Timur").nextAll(".guest-card").first();

        case 13:
            return $cards.filter(function () {
                return $(this).next('.guest-card[data-color="black"]').length > 0;
            });

        case 14:
            return cardByName("Aruzhan");

        case 15:
            return $(".room").filter(function () {
                return $(this).find(".guest-card").length < 6;
            });

        case 16:
            return $(".room").filter(function () {
                const $r = $(this);
                return $r.find('.guest-card[data-things*="cup"]').length > 0 && $r.find('.guest-card[data-things*="glasses"]').length === 0;
            });

        case 17:
            return $cards.filter(":first-child");

        case 18:
            return cardByName("Miras");

        case 19:
            return cardByName("Natasha");

        case 20:
            return $cards.filter(function () {
                const $g = $(this);
                const things = ($g.attr("data-things") || "").split(",").filter(Boolean);
                const room = $g.closest(".room").attr("data-room");
                const time = $g.attr("data-time");

                const nextAITU = $g.next('.guest-card[data-aitu="true"]').length > 0;
                const prevAITU = $g.prev('.guest-card[data-aitu="true"]').length > 0;

                return (room === "Kitchen" || room === "Living room") &&
                    time > "21:00" &&
                    time < "21:30" &&
                    things.includes("crumbs") &&
                    !things.includes("cup") &&
                    (nextAITU || prevAITU);
            });
    }
}

function showResult(n, $found) {
    const names = $found.map(function () {
        return $(this).attr("data-name") || $(this).attr("data-room") || $(this).find("h2").text();
    }).get();

    const unique = [...new Set(names)];

    $("#caseResult").html(`<strong>Case ${n}: ${unique.length} result(s)</strong><span class="result-names">${unique.length ? unique.join(", ") : "No matching guests found."}</span>`);
}

function spotlight($found) {
    allCards().stop(true).fadeTo(300, .2).removeClass("found");
    $(".room").removeClass("room-found");

    const $guestResults = $found.filter(".guest-card");

    $guestResults.stop(true).fadeTo(300, 1).addClass("found").each(function () {
        const $el = $(this);
        $el.animate({ top: "-8px" }, 130).animate({ top: "0px" }, 180);
    });

    $found.filter(".room").each(function () {
        const $room = $(this);
        $room.addClass("room-found");
        $room.find(".guest-card").stop(true).fadeTo(300, 1).addClass("found");
    });

    showResult(Number($(".case-button.active").data("case")), $found);
}

function clearSpotlight() {
    allCards().stop(true).fadeTo(200, 1).removeClass("found");
    $(".room").removeClass("room-found");
    $(".case-button").removeClass("active");
    $("#caseResult").html("<strong>Spotlight cleared.</strong><span>All guests are visible.</span>");
}

function openGuestModal(name) {
    const room = rooms.find(r => r.guests.some(g => g.name === name));
    if (!room) return;

    const g = room.guests.find(x => x.name === name);
    openGuest = name;

    const things = g.things.length ? g.things.map(t => ({
        phone: "phone",
        glasses: "glasses",
        bag: "a bag",
        cup: "a cup",
        crumbs: "cake crumbs"
    }[t])).join(", ") : "nothing";

    const otherRooms = rooms.filter(r => r.name !== room.name);

    $("#modalContent").html(`<img class="modal-avatar" src="${avatarUrl(g.name)}" style="--guest-color:${g.color}"><h2 class="modal-title" id="modalName">${g.name}</h2><div class="modal-info">Room: <b>${room.name}</b><br>Came at <b>${g.time}</b><br>Clothing: <b>${g.color}</b><br>${g.aitu ? "AITU student" : "Not an AITU student"}<br>Has: <b>${things}</b></div><div class="move-actions">${otherRooms.map(r => `<button class="button moveBtn" data-target="${r.name}">Move to ${r.name}</button>`).join("")}</div>`);

    const $modal = $("#guestModal");
    $modal.css("display", "flex").attr("aria-hidden", "false");

    const $box = $modal.find(".guest-modal");
    $box.stop(true).css({ width: 100, opacity: 0 }).animate({ width: 430, opacity: 1 }, 280);
}

function closeGuestModal() {
    const $modal = $("#guestModal");
    const $box = $modal.find(".guest-modal");

    $box.stop(true).animate({ width: 100, opacity: 0 }, 180, function () {
        $modal.hide().attr("aria-hidden", "true");
        openGuest = null;
    });
}

function moveGuest(name, target) {
    const source = rooms.find(r => r.guests.some(g => g.name === name));
    const destination = getRoom(target);

    if (!source || !destination) return;

    const $card = cardByName(name);
    const start = $card.offset();

    const $clone = $card.clone().appendTo("body").addClass("moving").css({
        position: "absolute",
        left: start.left,
        top: start.top,
        width: $card.outerWidth(),
        margin: 0,
        pointerEvents: "none"
    });

    source.guests = source.guests.filter(g => g.name !== name);

    const guest = initialRooms.flatMap(r => r.guests).find(g => g.name === name) || {
        name,
        color: $card.data("color"),
        time: $card.data("time"),
        aitu: $card.data("aitu"),
        things: ($card.attr("data-things") || "").split(",").filter(Boolean)
    };

    destination.guests.push(guest);

    $card.stop(true).fadeOut(220, function () {
        $(this).remove();
    });

    const $target = $(document.getElementById("room-" + target));
    const end = $target.offset();

    $clone.animate({
        left: end.left + 30,
        top: end.top + 65,
        width: 70,
        opacity: .2
    }, 420, function () {
        $(this).remove();
        renderParty();
    });

    closeGuestModal();

    $("#caseResult").html(`<strong>${name} moved.</strong><span>${name} is now in ${target}.</span>`);
}

function sortRoom($room) {
    const name = $room.attr("data-room");
    const room = getRoom(name);

    if (!room) return;

    const sorted = $room.data("sorted") !== true;
    const $list = $room.find(".guest-list");
    const $cards = $list.children(".guest-card");

    const positions = [];

    $cards.each(function () {
        positions.push({
            el: this,
            left: $(this).position().left,
            top: $(this).position().top
        });
    });

    const original = initialRooms.find(r => r.name === name);

    const ordered = sorted ?
        [...room.guests].sort((a, b) => a.time.localeCompare(b.time)) :
        [
            ...original.guests.filter(g => room.guests.some(x => x.name === g.name)),
            ...room.guests.filter(g => !original.guests.some(x => x.name === g.name))
        ];

    room.guests = ordered;
    $room.data("sorted", sorted);

    renderParty();

    const $newCards = $list.children(".guest-card");

    $newCards.each(function () {
        const old = positions.find(p => $(p.el).data("name") === $(this).data("name"));

        if (old) {
            const $el = $(this);
            const newPos = $el.position();

            $el.css({
                position: "relative",
                left: old.left - newPos.left,
                top: old.top - newPos.top
            });

            $el.animate({ left: 0, top: 0 }, 350, function () {
                $(this).css({ position: "relative", left: 0, top: 0 });
            });
        }
    });
}

$(function () {

    renderParty();
    buildCases();

    $(document).on("click", ".case-button", function () {

        const n = Number($(this).data("case"));

        $(".case-button").removeClass("active");
        $(this).addClass("active");

        renderParty();

        if (n === 18) {

            const hall = getRoom("Living room");

            const miras = {
                name: "Miras",
                color: "blue",
                time: "21:20",
                aitu: true,
                things: ["phone"]
            };

            hall.guests.splice(hall.guests.findIndex(g => g.name === "Inkar"), 0, miras);

            renderParty();

            const $m = cardByName("Miras").hide();
            $m.fadeIn(500);

            $("#caseResult").html("<strong>Case 18: Miras arrived.</strong><span>Miras joined Askar and Inkar.</span>");

            return;
        }

        if (n === 19) {

            const $natasha = cardByName("Natasha");

            $natasha.fadeOut(500, function () {

                getRoom("Living room").guests = getRoom("Living room").guests.filter(g => g.name !== "Natasha");

                $(this).remove();

                $("#caseResult").html("<strong>Case 19: Natasha left.</strong><span>Her card faded out and was removed.</span>");
            });

            return;
        }

        const $found = chainCase(n) || $();

        spotlight($found);

    });

    $("#clearBtn").on("click", clearSpotlight);

    $("#resetBtn").on("click", function () {
        rooms = structuredClone(initialRooms);
        $(".room").removeData("sorted");
        renderParty();
        clearSpotlight();
    });

    $(document).on("click", ".guest-card", function () {
        openGuestModal($(this).data("name"));
    });

    $(document).on("keydown", ".guest-card", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openGuestModal($(this).data("name"));
        }
    });

    $("#closeModal").on("click", closeGuestModal);

    $("#guestModal").on("click", function (e) {
        if (e.target === this) closeGuestModal();
    });

    $(document).on("keydown", function (e) {
        if (e.key === "Escape" && openGuest) closeGuestModal();
    });

    $(document).on("click", ".moveBtn", function () {
        if (openGuest) moveGuest(openGuest, $(this).data("target"));
    });

    $(document).on("click", ".sortBtn", function () {
        sortRoom($(this).closest(".room"));
    });

});
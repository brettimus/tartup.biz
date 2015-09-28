$(document).ready(function() {

    // Animation Globals
    var K = 1; // animation multiplier
    var hide = {
        p: {
            opacity: [0, 1],
        },
        o: {
            display: "none",
            duration: K*600,
        },
    };
    var show = {
        p: {
            opacity: [1, 0],
        },
        o: {
            display: "block",
            duration: K*600,
        },
    };

    var $header = $("header");
    var $ourForm = $("#main-form");
    var $stripeForm = $("#stripe-form");

    var $needButton = $("#need-button");

    var $name = $("#name");
    var $nameInputs = $name.find("input");
    var $nameNext = $name.find("button");

    var $portland = $("#portland");
    var $portlandPrice = $("#portland-price");
    var $portlandPriceButton = $portlandPrice.find("button");

    var $ship = $("#ship");
    var $shipPrice = $("#ship-price");
    var $shipPriceButton = $shipPrice.find("button");

    var $address = $("#address");

    var $email = $("#email");

    var $goodbye = $("#goodbye");

    // Progress
    var $progress = $("#progress-bar");
    var $step = $("[data-step]");
    var $stepMessage = $("[data-step-message]");

    // Attach handlers
    $needButton.click(needHandler);
    $nameInputs.on("change keyup", nameChangeHandler);
    $nameNext.click(nameNextHandler);
    $portland.change(portlandHandler);
    $ship.change(shipHandler);

    // Stripe form
    $('#stripe-form').submit(function(event) {
        var $form = $(this);

        // Disable the submit button to prevent repeated clicks
        $form.find('button').prop('disabled', true);

        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
    });

    // "I need a poptart"
    function needHandler() {
        var hideHeader = {
            p: {
                translateY: -1.5 * $header.height(),
            },
            o: {
                complete: showForm,
                display: "none",
                duration: K*300,
            }
        };
        $header.velocity(hideHeader);
    }

    // "First Name"
    function nameChangeHandler() {
        var name    = $nameInputs.val(),
            isEmpty = !$.trim(name);

        if (isEmpty) name = "…";
        $("[data-tarter-first-name]").text(name);
    }


    function nameNextHandler() {
        var name = $nameInputs.val();
        if (nameIsValid(name)) {
            transition($name, $portland);
            progress(40);
        }
        return false;
    }

    function nameIsValid(name) {
        return true;
    }

    function portlandHandler() {
        var userInPortland = $("#portland_true").is(":checked");

        if (userInPortland)
            inPortlandHandler();
        else
            notInPortlandHandler();
    }

    function inPortlandHandler() {
        if ($ship.is(":visible")) hideField($ship);
        if ($shipPrice.is(":visible")) hideField($shipPrice);
        showField($portlandPrice);
        progress(40);
    }

    function notInPortlandHandler() {
        if ($portlandPrice.is(":visible")) hideField($portlandPrice);
        showField($ship);
        progress(40);
    }

    function shipHandler() {
        var userWantShip = $("#ship_true").is(":checked");

        if (userWantShip) {
            showField($shipPrice);
        }
        else {
            showField($goodbye);
        }
    }

    function priceHandler() {
        // nyi
        throw new Error("NYI");
    }

    // Helpers
    function hideHeader() {

    }

    function showForm() {
        showElt($ourForm);
    }

    function hideField($field) {
        hideElt($field);
    }

    function showField($field) {
        showElt($field);
    }

    // Hide/show animations

    function transition($from, $to) {
        var modHideOptions = extend(hide.o, {
            complete: function() {
                showElt($to);
            },
        });
        $from.velocity(hide.p, modHideOptions);
    }

    function hideElt($elt) {
        $elt.velocity(hide.p, hide.o);
    }

    function showElt($elt) {
        $elt.velocity(show.p, show.o);
    }

    function progress(percent) {
        $progress
            .velocity({
                width: percent+"%"
            }, {
                duration: 400,
            });
    }


    function extend(o) {
        var args   = [].slice.call(arguments, 0),
            result = args[0];

        for (var i=1; i < args.length; i++) {
            result = extendHelper(result, args[i]);
        }

        return result;
    }

    function extendHelper(destination, source) {
        for (var k in source) {
            if (source.hasOwnProperty(k)) {
                destination[k] = source[k];
            }
        }
        return destination;
    }
});
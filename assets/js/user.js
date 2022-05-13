let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    audience: config.audience,
  });
};
window.onload = async () => {
  await configureClient();
  const isAuthenticated = await auth0.isAuthenticated();

  const query = window.location.search;

  if (query.includes("code=") && query.includes("state=")) {
    const isCallback = await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, location.protocol + "//" + location.host + location.pathname);
    console.log("handle redirect");
  }

  console.log("post redirect");

  if (isAuthenticated) {
    if (window.location.pathname.includes("login-gateway") === true) {
      console.log("true");
      window.location.replace("/u/account-settings/profile/");
    }

    console.log(JSON.stringify(await auth0.getUser()));
    $("body").data("auth", await auth0.getTokenSilently());
    var userInfo = await auth0.getUser();

    $("#img-uploaded").attr("src", userInfo.picture);
    $("#img-uploaded2").attr("src", userInfo.picture);
    $("#insert-name").text(userInfo.name);
    Sentry.setUser({ email: userInfo.email });

    getBids();
  } else {
    //user not logged in; redirect to auth0 to login

    await auth0.loginWithRedirect({
      redirect_uri: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + "/u/account-settings/profile/",
    });
  }
};

function getBids() {
  var latest;
  $.ajax({
    url: "https://oneweektickets.com/api/bid/1",
    //TODO event-id(1) is hardcoded, should be dynamic = https://oneweektickets.com/api/bid/1
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + $("body").data("auth"));
    },
    contentType: "application/json",
    success: async function (result) {
      //print out some <li>'s for each bid; date, time, amount per ticket, qty tickets, total (including service fees)
      console.log(result);
      $(result).each(function (index) {
        if (this.state == "ACTIVE") {
          latest = index;
          console.log("found it" + latest);
        }
      });
      if (latest == undefined) {
        var latest = $(result).length - 1;
      }
      console.log(result[latest]);
      $("#eventname").text(result[latest].name);
      if (result[latest].quantity > 1) {
        plural = "s";
        each = " each";
      } else {
        plural = "";
        each = "";
      }
      $("#bid").text(result[latest].quantity + " ticket" + plural + " at " + currency(result[latest].amount / 100).format() + each + ", plus tax");

      switch (result[latest].state) {
        case "CANCEL":
          $("#eventstate").addClass("badge bg-dark-soft");
          $("#eventstate").text("Bid Withdrawn");
          $(".cancelopt").hide();
          $(".cancelopt").text("Place new bid");

          break;
        case "ACTIVE":
          $("#eventstate").addClass("badge bg-warning-soft");

          $("#eventstate").text("Active - Not Yet Won");
          break;
        case "ENDED":
          $("#eventstate").addClass("badge bg-danger-soft");
          $(".cancelopt").hide();
          $(".updateopt").hide();
          $("#eventstate").text("Bid Lost");
          break;
        case "PURCHASE_COMPLETE":
          $("#eventstate").addClass("badge bg-success-soft");
          $(".cancelopt").hide();
          $(".updateopt").hide();
          $("#eventstate").text("Bid Won!");
          break;
      }

      $("#myeventsloading").hide();
      if ($(result).length == 0) {
        $("#myeventsnone").removeClass("d-none").show();
      } else {
        $("#myevents").removeClass("d-none").show();
      }
    },
    error: function () {
      $("#errorload").text("API error");
    },
  });
}

$(".cancelbtn").click(function () {
  //cancelBid($(this).data("event"));
  cancelBid(1);
});
function cancelBid(which) {
  var r = confirm("Are you sure you want to cancel your bid?\nThis will fully withdraw your bid.");
  if (r == true) {
    $.ajax({
      url: "https://oneweektickets.com/api/bid/cancel/" + which,
      //TODO event-id(1) is hardcoded, should be dynamic = https://oneweektickets.com/api/bid/1
      type: "POST",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + $("body").data("auth"));
      },
      contentType: "application/json",
      success: async function (result) {
        $("#eventstate").addClass("bg-light-danger");
        $("#eventstate").text("Bid Withdrawn");
        $(".cancelbtn").hide();
      },
      error: function () {
        $("#messageload").text("Oops!");
        $("#errorload").text("API error: unable to cancel your bid. refresh and try again.");
      },
    });
  }
}
// Sortable tables
function setUpTable(){
  var options = {
    valueNames: [ 'repository', 'source', 'language', 'update', 'stars', 'forks' ],
    page: 2000
  };

  var reposTable = new List('repos_table', options);

  reposTable.sort('repository', { order: "asc" });

  // $("#repos_survey").on("keyup", "input", function () {
  //   var numResults = $("#repos_survey tbody tr").length;
  //   $(".results").text(numResults);
  // });
  $('#repos_table table').stickyTableHeaders();

}


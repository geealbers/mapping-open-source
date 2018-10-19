// Sortable tables
function setUpTable(){
  var options = {
    valueNames: [ 'repository', 'source', 'language', 'update', 'stars', 'forks' ],
    page: 2000
  };

  var reposTable = new List('mapping', options);

  reposTable.sort('repository', { order: "asc" });

  $("#mapping").on("keyup", "input", function () {
    var numResults = $("#repos_table tbody tr").length;
    $(".results").text(numResults);
  });
  $('#mapping table').stickyTableHeaders();

}


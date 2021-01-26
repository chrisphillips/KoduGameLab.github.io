---
title: Kodu Game Lab
subtitle: 3D game programming for kids.
layout: page
hide_hero: true
show_sidebar: false
---
<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-12">
                <div class="columns is-multiline world-container">
                      <div class="column is-12">
                          <p data-type='resulttitle' class="title is-3">Latest Worlds
                          </p>
                      </div>
                      <div class="column is-2-desktop is-4-tablet world-item">
                        <a href="/bulma-clean-theme/products/product2/">
                          <div class="card">
                            <div class="card-image">
                              <figure class="image is-4by3">
                                <img data-type='thumbnail' src="https://via.placeholder.com/128x128" alt="World Name">
                              </figure>
                            </div>
                            <div class="card-content p-3">
                              <p data-type='worldname' class="title is-6">World Name
                              </p><p data-type='authorname' class="subtitle is-6">by Author Name</p>  
                              <p><time data-type='ago' class="timeago title is-7 has-text-right">X days Ago</time></p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                      <a class="pagination-previous">Previous</a>
                      <a class="pagination-next">Next page</a>
                      <ul class="pagination-list" style="list-style: none;">
                        <li><a class="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a></li>
                        <li><a class="pagination-link" aria-label="Goto page 2">2</a></li>
                        <li><a class="pagination-link" aria-label="Goto page 3">3</a></li>
                        <li><a class="pagination-link" aria-label="Goto page 4">4</a></li>
                        <li><span class="pagination-ellipsis">&hellip;</span></li>
                        <li><a class="pagination-link" aria-label="Goto page 10">10</a></li>
                      </ul>
                    </nav>                  
               
            </div>
        </div>
    </div>
</section>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-timeago/1.6.7/jquery.timeago.min.js" crossorigin="anonymous"></script>

<script>
$().ready(function(){
    //console.log("here");
    $(".world-item").hide();//hide template at start.
    jQuery.timeago.settings.strings.minute = "1 minute";//remove "about" (ug)
    jQuery.timeago.settings.strings.hour = "1 hour";
    jQuery.timeago.settings.strings.hours = "%d hours";
    
    let url = "https://koduworlds.azurewebsites.net/latest"
    let search = document.URL.split("?q=")[1]
    if(search)
    {
        url = "https://koduworlds.azurewebsites.net/search/"+search
        $("[data-type='resulttitle']").text("Results for:"+search)
    }
    //console.log("there");
    $.post( url, function( data ) {
        //console.log(data);
        //$("#text").html(data["text"]);
        for(world of data)
        {
            //copy first item (template)
            let item=$(".world-item").first().clone();
            //and fill it in with world data
            item.find("[data-type='worldname']").text(world.Name);
            item.find("[data-type='authorname']").text("by "+world.Creator);
            item.find("[data-type='ago']").text(world.Modified);
            item.find("[data-type='ago']").attr("datetime",world.Modified);
            item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/thumbnail/"+world.PrimaryId)
            item.show();//defaults to hidden so show.

            $(".world-container").append(item );
        }
        $(".timeago").timeago();
    });
});
</script>

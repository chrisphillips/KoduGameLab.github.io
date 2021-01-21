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
                          <p class="title is-3">Latest Worlds
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
                              <p data-type='ago' class="title is-7 has-text-right">X days Ago</p>
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
                        <li><a class="pagination-link" aria-label="Goto page 86">86</a></li>
                      </ul>
                    </nav>                  
               
            </div>
        </div>
    </div>
</section>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

<script>
$().ready(function(){
    //console.log("here");
    $(".world-item").hide();//hide template at start.
    
    //console.log("there");
    $.post( "https://koduworlds.azurewebsites.net/oldhome", function( data ) {
        console.log(data);
        //$("#text").html(data["text"]);
        for(world of data)
        {
            let item=$(".world-item").first().clone();
            item.find("[data-type='worldname']").text(world.Name);
            item.find("[data-type='authorname']").text("by "+world.Creator);
            item.find("[data-type='ago']").text(world.Modified);
            item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/oldthumb/"+world.WorldId+"/thumb")
            item.show();//defaults to hidden so show.
            //console.log();                    
            $(".world-container").append(item );
        }
    });
});
</script>

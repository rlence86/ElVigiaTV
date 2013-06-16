            $(document).ready(function() {
                  cargarIndex();
            });
            function cargarIndex()
            {
                $.mobile.loading( 'show', {
                                 text: "Cargando",
                                 textVisible: true,
                                 textonly: true
                                 });
                urljson = "http://www.elvigiatv.es/api/get_recent_posts/?dev=1";
                $.ajax({
                       type: "GET",
                       url: urljson,
                       dataType: "json",
                       success: function(resp){
                       // we have the response
                       mostrarRespuestaPosts(resp);
                       },
                       error: function(e){
                       alert('Ocurrió un error');
                       }
                       });
                $.ajax({
                       type: "GET",
                       url: "http://www.elvigiatv.es/api/get_category_index/?dev=1",
                       dataType: "json",
                       success: function(resp){
                       mostrarRespuestaCategorias(resp);
                       },
                       error: function(e){
                       alert('Ocurrió un error');
                       }  
                       });
            }
            function GetURLParameter(sParam)
            {
                var sPageURL = window.location.search.substring(1);
                return GetParameter(sPageURL, sParam);
            }
            function GetParameter(sPageURL, sParam)
            {
                var sURLVariables = sPageURL.split('&');
                for (var i = 0; i < sURLVariables.length; i++)
                {
                    var sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] == sParam)
                    {
                        return sParameterName[1];
                    }
                }
                return false;
            }
            function cargarCategoria(catId){
                var parametro = GetURLParameter("cat");
                if(parametro != false){
                    urljson = "http://www.elvigiatv.es/api/get_category_posts/?id="+parametro+"&count=4";
                }
                $.ajax({
                       type: "GET",
                       url: urljson,
                       dataType: "json",
                       success: function(resp){
                            mostrarRespuestaPostsC(resp);
                       },
                       error: function(e){
                            alert('Ocurrió un error');
                       }
                       });
            }
            function mostrarRespuestaPosts(respuesta) {
                $("#contenedor").html(renderContenido(respuesta));
                postRender();
                $.mobile.loading('hide');
            }
            function mostrarRespuestaPostsC(respuesta) {
                $("#contenedor2").html(renderContenido(respuesta));
                postRender();
                $.mobile.loading('hide');
            }
            function renderContenido(respuesta){
                contenido = '';
                for(var i=0; i<respuesta.count; i++) {
                    var post = respuesta.posts[i];
                    contenido = contenido + '<article><div class="cuadrado"><br><div class="media"><img src='+getImagen(post)+' class="imagen"/></div><p id="titulo">'+post.title+'</p><div data-role="collapsible-set" data-inset="false"><div data-role="collapsible"><h3>Más info...</h3><p>'+post.content+'</p></div><div data-role="collapsible"><h3>Programa</h3><a href="video.html?video='+post.video+'" data-role="button" data-inline="true" data-transition="slideup">Ver vídeo</a></div></div></div></article>';
                }
                contenido = $(contenido);
                return contenido;
            }
            function postRender(){
                $("div").trigger( "create" );
                $("article div p").addClass("texto-titulo");
                $("div[data-role='collapsible'] p").removeClass("texto-titulo");
                $("div[data-role='collapsible'] p").addClass("parrafo");
            }
            function getImagen(post) {
                var video = post.video;
                if (video.indexOf("vimeo.com") >= 0) {
                    var campos = video.split('/');
                    var videoId = campos[campos.length -1];
                    return "http://www.elvigiatv.es/images/thumbnails/"+videoId+"s.jpg";
                } else if (video.indexOf("youtube.com") >= 0) {
                    var parametrosVideo = video.split("?")[1];
                    var videoVimeo = GetParameter(parametrosVideo, "v");
                    var urlImagen = "http://img.youtube.com/vi/"+videoVimeo+"/1.jpg";
                    return urlImagen;
                }
            }
            function mostrarRespuestaCategorias(respuesta) {
                var contenido = '';
                for(var i=0; i<respuesta.count;i++) {
                    var categoria = respuesta.categories[i];
                    contenido = contenido +'<li><a href="categoria.html?cat='+categoria.id+'" data-transition="slide">'+categoria.title+'</a></li>';
                }
                $("#listacategorias").append(contenido);
                $("#listacategorias").listview( "refresh" );
            }
            function verCategoria(cat){
                $.mobile.changePage( "categoria.html?cat="+cat, {
                                    allowSamePageTransition: true,
                                    reloadPage: true
                });
            }
            function cargarVideo(video){
                urlVideo = '';
                if(video.indexOf("vimeo.com")>=0){
                    urlVideo = getVimeoURL(video);
                    $("#contenedor3").html('<iframe style="margin-top: 90px" src='+urlVideo+' width="100%" height="30%" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>');
                } else if (video.indexOf("youtube.com")) {
                    urlVideo = video;
                }
                postRender();
            }
            function getVimeoURL(url){
                var urlPartida = url.split("/");
                return 'http://player.vimeo.com/video/'+urlPartida[3];
            }

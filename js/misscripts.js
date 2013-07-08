            $(document).ready(function(){
                  $.mobile.loading( 'show', {
                                   text: "Cargando",
                                   textVisible: true,
                                   textonly: true
                                   });
                  cargarIndex();
                  });
            function cargarIndex()
            {
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
                            mostrarErrorIndex();
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
            function cargarCategoria(catId,pagina){
                var parametro = GetURLParameter("cat");
                if(parametro != false){
                    urljson = "http://www.elvigiatv.es/api/get_category_posts/?id="+parametro+"&page="+pagina;
                }
                $.ajax({
                       type: "GET",
                       url: urljson,
                       dataType: "json",
                       success: function(resp){
                            mostrarRespuestaPostsC(resp,pagina);
                       },
                       error: function(e){
                            mostrarErrorCategoria();
                       }
                       });
            }
            function mostrarRespuestaPosts(respuesta) {
                $("#contenedor").html(renderContenido(respuesta));
                postRender();
                $.mobile.loading('hide');
            }
            function mostrarRespuestaPostsC(respuesta,pagina) {
                var limite = parseInt(respuesta.pages);
                var numPag = parseInt(pagina);
                var paginanueva = numPag + 1;
                var paginaanterior = numPag - 1;
                $("#contenedor2").html(renderContenido(respuesta));
                if(numPag > 1 && numPag < limite){
                $("#contenedor2").append('<a href="categoria.html?cat='+respuesta.category.id+'&pag='+paginaanterior+'" data-role="button" data-icon="arrow-l" data-iconpos="left" data-inline="true" data-transition="slide" data-direction="reverse">Anterior</a><a style="float: right;" href="categoria.html?cat='+respuesta.category.id+'&pag='+paginanueva+'" data-role="button" data-icon="arrow-r" data-iconpos="right" data-inline="true" data-transition="slide">Siguiente</a>');
                } else if (numPag == limite && numPag == 1) {
                    $("#contenedor2").append('');
                } else if (numPag == limite) {
                    $("#contenedor2").append('<a href="categoria.html?cat='+respuesta.category.id+'&pag='+paginaanterior+'" data-role="button" data-icon="arrow-l" data-iconpos="left" data-inline="true" data-transition="slide" data-direction="reverse">Anterior</a>');
                } else if (numPag == 1){
                    $("#contenedor2").append('<a style="float: right;" href="categoria.html?cat='+respuesta.category.id+'&pag='+paginanueva+'" data-role="button" data-icon="arrow-r" data-iconpos="right" data-inline="true" data-transition="slide">Siguiente</a>');
                } 
                postRender();
                $.mobile.loading('hide');
            }
            function renderContenido(respuesta){
                contenido = '';
                for(var i=0; i<respuesta.count; i++) {
                    var post = respuesta.posts[i];
                    contenido = contenido + '<article><div data-role="popup" id="popup'+i+'" data-overlay-theme="a" data-theme="d" data-tolerance="15,15" class="ui-content"><iframe src="'+getVideoURL(post.video)+'" class="video" frameborder="0" allowfullscreen seamless></iframe></div><div class="cuadrado"><br><div class="media"><a href="#popup'+i+'" data-rel="popup"><img src='+getImagen(post)+' class="imagen"/></a></div><p id="titulo">'+post.title+'</p><div data-role="collapsible-set" data-inset="false"><div data-role="collapsible"><h3>Más info...</h3><p>'+post.content+'</p></div></div></div></article>';
                }
                contenido = $(contenido);
                return contenido;
            }
            function mostrarErrorIndex(){
                $("#contenedor").html('<div class="cuadrado"><img src="themes/images/logoerror.png" class="fotoerror"/><p class="textoError">Ocurrió un error cargando el contenido de El Vigía TV.</p><p class="textoError">Comprueba que tienes activa tu conexión a Internet e inténtalo de nuevo.</p></div>');
                postRender();
                $.mobile.loading('hide');
            }
            function mostrarErrorCategoria(){
                $("#contenedor2").html('<div class="cuadrado"><img src="themes/images/logoerror.png" class="fotoerror"/><p class="textoError">Ocurrió un error cargando el contenido de El Vigía TV.</p><p class="textoError">Comprueba que tienes activa tu conexión a Internet e inténtalo de nuevo.</p></div>');
                postRender();
                $.mobile.loading('hide');
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
                    contenido = contenido +'<li><a href="categoria.html?cat='+categoria.id+'&pag=1" data-transition="slide">'+categoria.title+'</a></li>';
                }
                $("#listacategorias").html(contenido);
                $("#listacategorias").listview( "refresh" );
            }
            function verCategoria(cat){
                $.mobile.changePage( "categoria.html?cat="+cat, {
                                    allowSamePageTransition: true,
                                    reloadPage: true
                });
            }
            $("iframe").load(function() {
                alert("cargado");
            });
            function getVideoURL(direccion){
                if(direccion.indexOf("vimeo.com") !== -1){
                    return getVimeoURL(direccion);
                } else if(direccion.indexOf("youtube.com") !== -1){
                    return getYoutubeURL(direccion);
                }
            }
            function getVimeoURL(direccion){
                var urlPartida = direccion.split("/");
                return 'http://player.vimeo.com/video/'+urlPartida[3];
            }
            function getYoutubeURL(direccion){
                var video_id = direccion.split('v=')[1];
                var ampersandPosition = video_id.indexOf('&');
                if(ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition);
                }
                var urlDevuelta = 'http://www.youtube.com/embed/'+video_id;
                return urlDevuelta;
            }

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html ng-app='DemoApp'>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>幻灯片</title>
    <meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
    <link rel="stylesheet" href="/fair/ipad/B2B/css/angular-carousel.css">
    <link rel="stylesheet" href="/fair/ipad/slide/css/demo.css">
    <link rel="stylesheet" href="/fair/ipad/slide/css/slide.css">
    <script src="/fair/ipad/js/AngularJS/angular.min1.4.2.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-carousel.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-touch.min.js"></script>
    <!--<script src="js/ui-bootstrap.min.js"></script>-->
    <script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
    <script type="text/javascript" src="/fair/ipad/slide/js/slide.js"></script>
</head>
    <body ng-controller="DemoCtrl">
                <div class="carousel-demo" interval="myInterval">
                    <ul rn-carousel rn-carousel-index="carouselIndex2" rn-carousel-auto-slide="12" rn-carousel-pause-on-hover rn-carousel-buffered class="carousel2">
                        <li ng-repeat="slide in slides2 " ng-class="'id-' + slide.id">
                            <div style="background: url({{slide.imageurl}}) no-repeat;background-size:75% 100%;background-position:right center"  class="bgimage">
                                <table cellspacing="10" cellpadding="10">
                                    <tr>
                                        <th>No.{{slide.rownum}}</th>
                                        <th></th>
                                    </tr>
                                    <tr><td>{{slide.attr1}}</td><td>{{slide.attr2}}</td></tr>
                                    <tr><td>{{slide.attr3}}</td><td>{{slide.attr4}}</td></tr>
                                    <tr><td>{{slide.attr5}}</td><td>{{slide.attr6}}</td></tr>
                                </table>
                            </div>
                        </li>
                    </ul>
                </div>
    </body>
</html>

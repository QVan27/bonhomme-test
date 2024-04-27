<header class="header">
    <div class="container-fluid">
        <div class="row">
            <div class="col-22 offset-1 col-lg-18 offset-lg-3">
                <div class="header__container u-flex-between">
                    <a class="u-upper header__logo" href="{{ home_url() }}">
                        {{ display_svg('four-dots') }}
                        menu
                    </a>
                    <nav>
                        <ul>
                            @php
                                $menu = [
                                    '#popular' => 'Popular',
                                    '#now-showing' => 'Now Showing',
                                    '#watchlist' => 'Watchlist',
                                ];
                            @endphp
                            @foreach ($menu as $slug => $name)
                                <li>
                                    <a class="u-upper" href="{{ home_url($slug) }}">{{ $name }}</a>
                                </li>
                            @endforeach
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</header>

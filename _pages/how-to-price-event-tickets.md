---
title: How to price event tickets
description: Explore use-cases for how to best price your event tickets
layout: page
---

<div class="pb-12 mt-md-n16 mt-n12">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-12 col-12">
        <h3 class="text-white mb-4">Use cases for OneWeek Tickets</h3>
        {% for landing-page in site.landing-pages %}
        <!-- card -->
        <div class="card border-0 rounded-3 bg-transparent mb-4 mb-md-8">
          <a href="{{ landing-page.url | absolute_url }}">
            <div class="bg-cover py-14 d-md-none rounded-top" style="background-image: url({{ landing-page.image | absolute_url }});"></div>
            <img src="{{ landing-page.image | absolute_url }}" alt="" class="img-fluid rounded-3 d-none d-md-block w-100" />
          </a>
          <!-- row -->
          <div class="row mt-md-n15 mt-n8 ms-md-4">
            <div class="col-lg-5 col-md-6 col-12">
              <!-- card -->
              <div class="card border-0 rounded-3 bg-primary">
                <!-- card body -->
                <div class="card-body p-4">
                  <!-- <img src="../assets/images/logo-airbnb.svg" alt="" class="color-white-filter mb-4" /> -->
                  <a href="{{ landing-page.url | absolute_url }}">
                    <h3 class="text-white mb-4">{{ landing-page.title }}</h3>
                  </a>
                  <a href="{{ landing-page.url | absolute_url }}" class="text-white">Read Full Case Study</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
  </div>
</div>

<script setup lang="ts">
/**
 * 返回首页
 */
function backHome() {
  const url = window.location.origin
  window.location.replace(url)
}
</script>

<template>
  <div flex-center bg="grey-1!">
    <div flex="~ col gap16" relative bottom="10%">
      <div flex="center col gap6">
        <svg width="227" height="174" viewBox="0 0 227 174" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="107.351" cy="87.0018" r="86.1" fill="#F2F7FB" />
          <g filter="url(#filter0_d_516_15740)">
            <rect x="16.0002" y="24" width="183.14" height="126" rx="8" fill="white" />
          </g>
          <rect x="30.6526" y="41.582" width="52.7421" height="11.7205" rx="2.93023" fill="#025CB9" fill-opacity="0.12" />
          <rect x="30.6526" y="67.2202" width="98.1621" height="11.7208" rx="2.93023" fill="#025CB9" fill-opacity="0.12" />
          <rect x="30.6526" y="115.568" width="34.0637" height="9.52287" rx="4.76143" fill="#025CB9" fill-opacity="0.12" />
          <rect x="70.5767" y="115.568" width="34.0637" height="9.52287" rx="4.76143" fill="#025CB9" fill-opacity="0.12" />
          <rect x="110.501" y="115.568" width="34.0637" height="9.52287" rx="4.76143" fill="#025CB9" fill-opacity="0.12" />
          <rect x="150.425" y="115.568" width="34.0637" height="9.52287" rx="4.76143" fill="#025CB9" fill-opacity="0.12" />
          <path d="M192.596 97.8942L225.273 154.491C225.772 155.354 226.034 156.333 226.034 157.33C226.034 158.326 225.772 159.305 225.274 160.168C224.775 161.031 224.059 161.748 223.196 162.246C222.333 162.744 221.354 163.007 220.357 163.007H155.002C154.006 163.007 153.027 162.744 152.164 162.246C151.301 161.748 150.584 161.031 150.086 160.168C149.588 159.305 149.325 158.326 149.325 157.33C149.325 156.333 149.588 155.354 150.086 154.491L182.763 97.8942C184.947 94.1095 190.409 94.1095 192.596 97.8942Z" fill="#A6B1C2" />
          <path d="M187.683 142.753C186.679 142.753 185.716 143.152 185.006 143.862C184.297 144.572 183.898 145.534 183.898 146.538C183.898 147.542 184.297 148.505 185.006 149.214C185.716 149.924 186.679 150.323 187.683 150.323C188.686 150.323 189.649 149.924 190.359 149.214C191.069 148.505 191.467 147.542 191.467 146.538C191.467 145.534 191.069 144.572 190.359 143.862C189.649 143.152 188.686 142.753 187.683 142.753ZM187.683 116.26C186.756 116.26 185.861 116.601 185.168 117.217C184.475 117.833 184.033 118.682 183.924 119.602L183.898 120.045V135.184C183.899 136.149 184.268 137.076 184.931 137.778C185.593 138.479 186.498 138.901 187.461 138.958C188.424 139.014 189.372 138.701 190.112 138.082C190.852 137.463 191.327 136.585 191.441 135.627L191.467 135.184V120.045C191.467 119.041 191.069 118.079 190.359 117.369C189.649 116.659 188.686 116.26 187.683 116.26Z" fill="white" />
          <circle cx="162.511" cy="47.4423" r="5.86023" fill="#025CB9" fill-opacity="0.12" />
          <circle cx="178.628" cy="47.4423" r="5.86023" fill="#025CB9" fill-opacity="0.12" />
          <defs>
            <filter id="filter0_d_516_15740" x="0.000244141" y="10" width="215.139" height="158" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.0520297 0 0 0 0 0.147829 0 0 0 0 0.487479 0 0 0 0.12 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_516_15740" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_516_15740" result="shape" />
            </filter>
          </defs>
        </svg>
        <div text-lg>
          您没有访问权限
        </div>
      </div>
      <ZBtn label="返回首页" size="big" self-center @click="backHome" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

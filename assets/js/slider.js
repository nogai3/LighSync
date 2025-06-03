const sliders = [
    {
        image: "../../assets/images/time-to-wakeup-banner-2560x932.png",
        title: "Время проснуться!",
        text: "Время проснуться от AAA проектов, которые представляют собой много-весный конвеер, не работающий без DLSS, время примкнуть к инди.",
        buttontext: "ПОСМОТРИТЕ, КАК >",
        link: "../../v1/index.html"

    },
    {
        image: "/assets/images/1.png",
        title: "1",
        text: "1",
        buttontext: "1",
        link: "1"
    },
    {
        image: "/assets/images/2.png",
        title: "2",
        text: "2",
        buttontext: "2",
        link: "2"
    },
    {
        image: "/assets/images/3.png",
        title: "3",
        text: "3",
        buttontext: "3",
        link: "3"
    }
];

const sliderMain = document.getElementById("sliderMain");
const sliderTitle = document.getElementById("sliderTitle");
const sliderText = document.getElementById("sliderText");
const sliderBtn = document.getElementById("sliderBtn");
const thumbs = document.querySelectorAll(".slider-thumbs img");

function setSlide(index) {
    const slide = sliders[index];
    sliderMain.style.backgroundImage = `url('${slide.image}')`;
    sliderTitle.textContent = slide.title;
    sliderText.textContent = slide.text;
    sliderBtn.textContent = slide.buttontext;
    sliderBtn.href = slide.link;

    thumbs.forEach(img => img.classList.remove('active'));
    thumbs[index].classList.add('active');
}

setSlide(0);

thumbs.forEach(img => {
    img.addEventListener('click', () => {
        const index = parseInt(img.dataset.index);
        setSlide(index);
    });
});
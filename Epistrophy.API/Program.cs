var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Epistrophy.API", builder =>
    {
        builder.WithOrigins("*");
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Epistrophy.API");

app.MapGet("", () => Catalog.All);

app.MapGet("/genres", () => Catalog.Genres);

app.MapGet("/genres/{genre}/artists", (int genre) => Catalog.Artists(genre));

app.MapGet("/genres/{genre}/artists/{index}", (int genre, int index) => Catalog.Artist(genre, index));

app.Run();
